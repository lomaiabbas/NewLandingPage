import { notification } from 'antd'
import { createContext, useMemo } from 'react'

export const NotificationContext = createContext<any>({ name: 'Default', api: undefined })

export const NotificationProvider = ({ children }: any) => {
  const [api, contextHolder] = notification.useNotification({
    stack: {
      threshold: 3,
    },
  })
  const contextValue = useMemo(() => ({ name: 'Notifications', api: api }), [])

  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  )
}
