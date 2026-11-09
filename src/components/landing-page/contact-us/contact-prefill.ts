import type { ContactMessageType } from '@/lib/services/landing-requests'

const CONTACT_PREFILL_EVENT = 'contact-prefill'

/** asks the contact form to select a message type; the visitor can still change it */
export function prefillContactType(type: ContactMessageType) {
  window.dispatchEvent(new CustomEvent<ContactMessageType>(CONTACT_PREFILL_EVENT, { detail: type }))
}

/** calls `onPrefill` whenever another part of the page asks for a message type; returns the cleanup */
export function onContactPrefill(onPrefill: (type: ContactMessageType) => void) {
  const handler = (event: Event) => onPrefill((event as CustomEvent<ContactMessageType>).detail)
  window.addEventListener(CONTACT_PREFILL_EVENT, handler)
  return () => window.removeEventListener(CONTACT_PREFILL_EVENT, handler)
}
