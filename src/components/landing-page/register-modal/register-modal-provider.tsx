'use client'

import dynamic from 'next/dynamic'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { REGISTER_QUERY_PARAM, isRegisterHref } from './register-modal.data'

/* the form, its validation and libphonenumber only load once somebody heads for the modal */
const loadRegisterModal = () => import('./index')
const RegisterModal = dynamic(loadRegisterModal, { ssr: false })

type RegisterModalContextValue = {
  isOpen: boolean
  /** focus goes back to `trigger` (default: whatever has focus now) when the modal closes */
  openRegister: (trigger?: HTMLElement | null) => void
  closeRegister: () => void
}

const RegisterModalContext = createContext<RegisterModalContextValue | null>(null)

/** null outside the landing page, where there's no modal to open (the /register page, say) */
export const useRegisterModal = () => useContext(RegisterModalContext)

const hasRegisterParam = () =>
  new URLSearchParams(window.location.search).get(REGISTER_QUERY_PARAM) === '1'

const urlWithRegisterParam = (on: boolean) => {
  const url = new URL(window.location.href)
  if (on) url.searchParams.set(REGISTER_QUERY_PARAM, '1')
  else url.searchParams.delete(REGISTER_QUERY_PARAM)
  return url.pathname + url.search + url.hash
}

export default function RegisterModalProvider({
  lng,
  children,
}: {
  lng: string
  children: ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  // mounted from the first open on and never unmounted again, so closing keeps what was typed
  const [hasOpened, setHasOpened] = useState(false)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  // whether the ?register=1 history entry was pushed by us, and so is ours to pop on close
  const pushedEntryRef = useRef(false)

  const openRegister = useCallback((trigger?: HTMLElement | null) => {
    const active = document.activeElement
    returnFocusRef.current = trigger ?? (active instanceof HTMLElement ? active : null)
    setHasOpened(true)
    setIsOpen(true)
    if (!hasRegisterParam()) {
      // an entry of its own, so the phone's Back button closes the modal instead of leaving the page
      window.history.pushState(null, '', urlWithRegisterParam(true))
      pushedEntryRef.current = true
    }
  }, [])

  const closeRegister = useCallback(() => {
    setIsOpen(false)
    if (pushedEntryRef.current) {
      pushedEntryRef.current = false
      window.history.back()
    } else if (hasRegisterParam()) {
      window.history.replaceState(null, '', urlWithRegisterParam(false))
    }
  }, [])

  useEffect(() => {
    // a shared link (?register=1) opens the modal; Back and Forward close and reopen it
    const syncWithUrl = () => {
      const open = hasRegisterParam()
      if (open) setHasOpened(true)
      else pushedEntryRef.current = false
      setIsOpen(open)
    }
    syncWithUrl()
    window.addEventListener('popstate', syncWithUrl)
    return () => window.removeEventListener('popstate', syncWithUrl)
  }, [])

  useEffect(() => {
    /* Every link on the page that leads to /register (the navbar and drawer buttons, the social
       proof toast, ...) opens the modal instead. Captured ahead of next/link, which then sees the
       click as handled. Modified clicks still open the page in a new tab. */
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(link instanceof HTMLAnchorElement) || !isRegisterHref(link.href)) return
      if (link.target === '_blank' || link.hasAttribute('download')) return
      event.preventDefault()
      openRegister(link)
    }
    // warm the modal's chunk as soon as such a link is pointed at or focused
    const preload = (event: Event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (link instanceof HTMLAnchorElement && isRegisterHref(link.href)) {
        loadRegisterModal().catch(() => {})
      }
    }
    document.addEventListener('click', onClick, true)
    document.addEventListener('pointerover', preload, { passive: true })
    document.addEventListener('focusin', preload)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('pointerover', preload)
      document.removeEventListener('focusin', preload)
    }
  }, [openRegister])

  const value = useMemo(
    () => ({ isOpen, openRegister, closeRegister }),
    [isOpen, openRegister, closeRegister]
  )

  return (
    <RegisterModalContext.Provider value={value}>
      {children}
      {hasOpened && (
        <RegisterModal
          lng={lng}
          open={isOpen}
          onClose={closeRegister}
          returnFocusRef={returnFocusRef}
        />
      )}
    </RegisterModalContext.Provider>
  )
}
