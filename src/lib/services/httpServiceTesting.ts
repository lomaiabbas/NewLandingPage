import { clientConfig } from '@/config'
import { Modal } from 'antd'
import axios from 'axios'
import i18next, { t } from 'i18next'

const http2 = axios.create({
  baseURL: 'https://api.atraslink.com',
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
    if (window.location?.href?.includes('admin'))
      window.location.href = `/${i18next.language}?needLogin`
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
    const params = new URLSearchParams(window.location.search)
    params.set('ref', new Date().getTime() + '')
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', newUrl)
  } else {
    refToken = ''
    token = ''
  }
}

// Request Interceptor
http2.interceptors.request.use(
  async function (config: any) {
    let t = localStorage?.getItem('logout')
    if (t) {
      localStorage.removeItem('logout')
      token = ''
      tenantId = ''
      refToken = ''
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      if (window.location?.href?.includes('tokenFromBialah')) {
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
          if (window.location?.href?.includes('admin'))
            window.location.href = `/${i18next.language}?needLogin`
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

// Response Interceptor
http2.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
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
          resolve(http2(originalRequest))
        })
      })
    }

    if (error.message.includes(`Unexpected token '<', \"<!DOCTYPE`)) {
      if (window.location?.href?.includes('admin'))
        window.location.href = `/${i18next.language}?needLogin`
    }

    if (
      !!error.response &&
      !!error.response.data.error &&
      !!error.response.data.error.message &&
      error.response.data.error.details
    ) {
      Modal.error({
        title: error.response.data.error.message,
        content: error.response.data.error.details,
      })
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
      } else {
        Modal.error({
          title: t('RequestError'),
          content: error.response.data.error.message?.includes('ContactIsExists')
            ? t('ImportedContactsAlreadyExist')
            : error.response.data.error.message,
          zIndex: 2147483648,
          okButtonProps: {
            color: 'primary',
          },
        })
      }
    } else if (!error.response) {
      if (!error.message.includes(`Unexpected token '<', \"<!DOCTYPE`)) {
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

export default http2
