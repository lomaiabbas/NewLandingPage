'use client'
import { useEffect, useState } from 'react'

export function useFacebookSDK(appId: string) {
  const [FBInstance, setFBInstance] = useState<typeof window.FB | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (window.FB) {
      setFBInstance(window.FB)
      return
    }

    ;(window as any).fbAsyncInit = function () {
      window.FB.init({
        appId: appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v21.0',
      })
      setFBInstance(window.FB)
    }

    const scriptId = 'facebook-jssdk'
    if (!document.getElementById(scriptId)) {
      const js = document.createElement('script')
      js.id = scriptId
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      js.async = true
      js.defer = true
      document.body.appendChild(js)
    }
  }, [appId])

  return FBInstance
}
