'use client'

import { CountryCodeDto } from '@/lib/services/countries-codes/dto'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { DEFAULT_DIAL_CODE } from './register-modal.data'
import styles from './register-modal.module.css'

const isoOf = (code: CountryCodeDto) => code.iso2Code.toUpperCase()
const withPlus = (code: string) => (code.startsWith('+') ? code : `+${code}`)

/* the same flag files the /register page's phone dropdown shows; `large` on the button itself */
function Flag({ iso, large = false }: { iso: string; large?: boolean }) {
  return (
    <Image
      src={`/images/flags/${iso.toLowerCase()}.svg`}
      width={large ? 28 : 22}
      height={large ? 20 : 16}
      alt=""
      className={large ? `${styles.flag} ${styles.flagLarge}` : styles.flag}
    />
  )
}

/* The phone's country code: a button with the flag and the code, opening the list of countries
   with their flags, as on the /register page (a native <select> can't show images). Focus stays
   on the button while the list is open (the select-only combobox pattern), so the modal's focus
   trap isn't disturbed. The list is portaled to `containerRef` (the overlay), out of the panel
   that would clip it. */
export default function DialCodePicker({
  codes,
  value,
  onChange,
  label,
  containerRef,
}: {
  codes: CountryCodeDto[]
  /** upper-case ISO code of the chosen country */
  value: string
  onChange: (iso: string) => void
  label: string
  /** read when the list opens: on the first render the container isn't mounted yet */
  containerRef: RefObject<HTMLElement>
}) {
  const id = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [place, setPlace] = useState<{ top: number; left: number; zoom: number } | null>(null)

  const selected = codes.find((code) => isoOf(code) === value)
  const dialCode = withPlus(selected?.dialCode ?? DEFAULT_DIAL_CODE)
  const optionId = (index: number) => `${id}option${index}`

  const openList = () => {
    if (!codes.length) return
    setActive(Math.max(0, codes.findIndex((code) => isoOf(code) === value)))
    setPlace(null)
    setOpen(true)
  }
  const choose = (index: number) => {
    const code = codes[index]
    if (code) onChange(isoOf(code))
    setOpen(false)
  }

  // under the button, or above it when the screen has no room below; zoomed like the modal
  useLayoutEffect(() => {
    const button = buttonRef.current
    const list = listRef.current
    if (!open || !button || !list) return
    const panel = button.closest<HTMLElement>('[role="dialog"]')
    const zoom = (panel && parseFloat(getComputedStyle(panel).zoom)) || 1
    const anchor = button.getBoundingClientRect()
    // measured before it takes the zoom (this first pass has none), so scaled to its drawn size
    const measured = list.getBoundingClientRect()
    const size = { width: measured.width * zoom, height: measured.height * zoom }
    let top = anchor.bottom + 6
    if (top + size.height > window.innerHeight - 8) top = Math.max(8, anchor.top - 6 - size.height)
    const left = Math.min(anchor.left, window.innerWidth - size.width - 8)
    setPlace({ top: top / zoom, left: Math.max(8, left) / zoom, zoom })
  }, [open])

  useEffect(() => {
    if (!open) return
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  // a press anywhere else, a resize or a scroll of the page closes the list
  useEffect(() => {
    if (!open) return
    const inside = (target: EventTarget | null) =>
      target instanceof Node &&
      (buttonRef.current?.contains(target) || listRef.current?.contains(target))
    const onPointerDown = (event: PointerEvent) => {
      if (inside(event.target)) return
      setOpen(false)
      // a press on the dimmed backdrop dismisses the list only, not the modal along with it
      if (event.target === containerRef.current) event.stopPropagation()
    }
    const onScroll = (event: Event) => {
      if (!inside(event.target)) setOpen(false)
    }
    const close = () => setOpen(false)
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', close)
    }
  }, [open, containerRef])

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = codes.length - 1
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault()
        if (!open) openList()
        else setActive((i) => Math.min(last, Math.max(0, i + (event.key === 'ArrowDown' ? 1 : -1))))
        break
      case 'Home':
      case 'End':
        if (!open) return
        event.preventDefault()
        setActive(event.key === 'Home' ? 0 : last)
        break
      // Enter's click is cancelled here, Space's on key-up, so the button doesn't toggle twice
      case 'Enter':
        event.preventDefault()
        if (open) choose(active)
        else openList()
        break
      case ' ':
        event.preventDefault()
        break
      case 'Escape':
        if (!open) return
        // closes the list only; the modal's own Esc listener mustn't see it
        event.preventDefault()
        event.stopPropagation()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        // a letter jumps to the next country whose name starts with it
        if (open && event.key.length === 1) {
          const letter = event.key.toLocaleLowerCase()
          const order = [...codes.keys()].map((n) => (active + 1 + n) % codes.length)
          const next = order.find((i) => codes[i].name.toLocaleLowerCase().startsWith(letter))
          if (next !== undefined) setActive(next)
        }
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        className={styles.dialCode}
        aria-label={`${label}: ${selected?.name ?? ''} ${dialCode}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}list`}
        aria-activedescendant={open ? optionId(active) : undefined}
        disabled={!codes.length}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        onKeyUp={(event) => {
          if (event.key !== ' ') return
          event.preventDefault()
          if (open) choose(active)
          else openList()
        }}
      >
        {/* the green button with two lines that stood before the flag:
        <span className={styles.dialButton} aria-hidden>
          <span />
          <span />
        </span>
        <Flag iso={value} />
        */}
        <Flag iso={value} large />
        <span className={styles.dialValue} aria-hidden>
          {dialCode}
        </span>
        {/* says it opens a list; turns over while the list is open */}
        <ChevronDown className={styles.dialChevron} size={14} strokeWidth={2.5} aria-hidden />
      </button>

      {open &&
        createPortal(
          <ul
            ref={listRef}
            id={`${id}list`}
            role="listbox"
            aria-label={label}
            className={styles.dialList}
            style={
              place
                ? { top: place.top, left: place.left, zoom: place.zoom }
                : { visibility: 'hidden' }
            }
          >
            {codes.map((code, index) => (
              <li
                key={code.iso2Code}
                id={optionId(index)}
                role="option"
                aria-selected={isoOf(code) === value}
                data-active={index === active}
                className={styles.dialOption}
                // keeps focus on the button
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
              >
                <Flag iso={code.iso2Code} />
                <span className={styles.dialOptionName}>{code.name}</span>
                <span className={styles.dialOptionCode} dir="ltr">
                  {withPlus(code.dialCode)}
                </span>
              </li>
            ))}
          </ul>,
          containerRef.current ?? document.body
        )}
    </>
  )
}
