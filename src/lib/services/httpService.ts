import { clientConfig } from '@/config'
import { message, Modal } from 'antd'
import axios from 'axios'
import i18next, { t } from 'i18next'

const isBrowser = typeof window !== 'undefined'

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  timeout: 40000,
  paramsSerializer: {
    indexes: true, // use brackets with indexes
  },
  withCredentials: false,
})

let token: any = ''
let refToken: any = ''
let tenantId = ''
let isRefreshing = false // Flag to indicate refresh in progress
let refreshSubscribers: ((newToken: string) => void)[] = [] // Queue for requests waiting for refresh

async function getTokens() {
  try {
    const res = await fetch(`/api/auth/get-cookies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      credentials: 'include', // Ensure cookies are sent
    })

    if (!res.ok) {
      throw new Error('Failed to refresh token')
    }

    const session = await res.json()
    token = session?.accessToken
    tenantId = session?.tenant
    refToken = session?.refreshToken

    return token
  } catch (error) {
    console.error('Token refresh failed:', error)

    if (isBrowser && window.location?.href?.includes('admin')) {
      window.location.href = `/${i18next.language}?needLogin`
    }

    return null
  }
}

async function getNewTokens() {
  const response = await fetch(`${clientConfig.url}/connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientConfig.client_id!,
      refresh_token: refToken,
    }),
  })

  const data = await response.json()

  if (response.ok) {
    fetch('/api/auth/set-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        refreshToken: data.refresh_token,
        accessToken: data.access_token,
        rememberMe: false,
      }),
    })

    refToken = data.refresh_token
    token = data.access_token

    if (isBrowser) {
      const params = new URLSearchParams(window.location.search)
      params.set('ref', new Date().getTime() + '')
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.replaceState({}, '', newUrl)
    }
  } else {
    refToken = ''
    token = ''
  }

  return token
}

http.interceptors.request.use(
  async function (config: any) {
    let tLogout = isBrowser ? localStorage.getItem('logout') : null

    if (tLogout && isBrowser) {
      localStorage.removeItem('logout')
      token = ''
      tenantId = ''
      refToken = ''
    }

    if (config.skipAuth) {
      config.headers['__tenant'] = tenantId ?? ''
      config.params = {
        ...config.params,
        culture: i18next.language,
      }
      return config
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      if (isBrowser && window.location?.href?.includes('tokenFromBialah')) {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        } else {
          const url = new URL(window.location.href)
          const params = new URLSearchParams(url.search)
          config.headers.Authorization = `Bearer ${params.get('tokenFromBialah')}`
          token = params.get('tokenFromBialah')
        }
      } else {
        let vv = await getTokens()
        token = vv

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        } else if (!token && refToken) {
          if (!isRefreshing) {
            isRefreshing = true
            try {
              token = await getNewTokens()
              config.headers.Authorization = `Bearer ${token}`
              refreshSubscribers.forEach((callback) => callback(token))
              refreshSubscribers = []
            } finally {
              isRefreshing = false
            }
          }

          return new Promise((resolve) => {
            refreshSubscribers.push((newToken) => {
              config.headers.Authorization = `Bearer ${newToken}`
              resolve(config)
            })
          })
        } else if (!token && !refToken) {
          if (isBrowser && window.location?.href?.includes('admin')) {
            window.location.href = `/${i18next.language}?needLogin`
          }
        }
      }
    }

    config.headers['__tenant'] = tenantId ?? ''
    config.params = {
      ...config.params,
      culture: i18next.language,
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const errorDisplayDuration = originalRequest?.errorDisplayDuration || 5

    // ✅ Skip global error UI if flag is set
    if (originalRequest?.skipErrorHandler) {
      return Promise.reject(error)
    }

    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout (Error Code => ECONNABORTED):', error.message)
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing && refToken && !token) {
        isRefreshing = true
        try {
          token = await getNewTokens()
          refreshSubscribers.forEach((callback) => callback(token))
          refreshSubscribers = []
        } finally {
          isRefreshing = false
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          resolve(http(originalRequest))
        })
      })
    }

    if (error.message.includes(`Unexpected token '<', \"<!DOCTYPE`)) {
      if (isBrowser && window.location?.href?.includes('admin')) {
        window.location.href = `/${i18next.language}?needLogin`
      }
    }

    if (
      !!error.response &&
      !!error.response.data.error &&
      !!error.response.data.error.message &&
      error.response.data.error.details
    ) {
      const msg = error.response.data.error.message
      const details = error.response.data.error.details

      if (originalRequest?.showErrorAsMessage) {
        message.error(`${msg} - ${details}`, errorDisplayDuration)
      } else {
        Modal.error({
          title: msg,
          content: details,
        })
      }
    } else if (
      !!error.response &&
      !!error.response.data.error &&
      !!error.response.data.error.message
    ) {
      if (
        error.response?.status === 420 ||
        error.response?.status === 490 ||
        error.response?.status === 302
      ) {
        if (isBrowser) {
          // await fetch('/api/auth/set-tokens', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     Accept: 'application/json',
          //   },
          //   body: JSON.stringify({
          //     refreshToken: ' ',
          //     accessToken: ' ',
          //     rememberMe: false,
          //     logout: true,
          //     tenant: ' ',
          //     companyInfo: ' ',
          //   }),
          // })
          document.cookie.split(';').forEach(function (c) {
            document.cookie = c
              .replace(/^ +/, '')
              .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
          })

          window.location.href = `/${i18next.language}?needAuth=${error.response.data.error.message}`
        }
      } else {
        if (
          error?.status === 404 &&
          error?.response?.request?.responseURL?.includes?.('/application-requests-for-admin/')
        ) {
        } else {
          const msg = t('RequestError')
          const details = error.response.data.error.message?.includes('ContactIsExists')
            ? t('ImportedContactsAlreadyExist')
            : error.response.data.error.message

          if (originalRequest?.showErrorAsMessage) {
            message.error(`${msg} - ${details}`, errorDisplayDuration)
          } else {
            Modal.error({
              title: msg,
              content: details,
              zIndex: 2147483648,
              okButtonProps: {
                color: 'primary',
              },
            })
          }
        }
      }
    } else if (!error.response) {
      if (!error.message.includes(`Unexpected token '<', \"<!DOCTYPE`)) {
        if (originalRequest?.showErrorAsMessage) {
          message.error(`${t('UnknownError')} - ${t('CheckNetwork')}`, errorDisplayDuration)
        } else
          Modal.error({
            title: t('UnknownError'),
            content: t('CheckNetwork'),
            zIndex: 2147483648,
            okButtonProps: {
              color: 'primary',
            },
          })
      }
    }

    return Promise.reject(error)
  }
)

export default http
