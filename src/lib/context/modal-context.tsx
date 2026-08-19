import { Modal } from 'antd'
import { createContext, useMemo } from 'react'

export const ModalContext = createContext<any>({ modal: undefined })

export const ModalProvider = ({ children }: any) => {
  const [modal, contextHolder] = Modal.useModal()

  const contextValue = useMemo(() => ({ modal: modal }), [])

  return (
    <ModalContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </ModalContext.Provider>
  )
}
