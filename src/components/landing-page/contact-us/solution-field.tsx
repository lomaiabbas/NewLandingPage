'use client'

import { getClientTranslation } from '@/app/i18n/client'
import { CalendarCheck, Megaphone, ShoppingBag } from 'lucide-react'
import { useId } from 'react'
import styles from './solution-field.module.css'

/* value: the fixed id sent in solutionType (the same in every language); label: the translation
   key the Solutions section uses. */
export const SOLUTIONS = [
  { value: 'events', label: 'SolutionEventsTitle', Icon: CalendarCheck },
  { value: 'comms', label: 'SolutionCampaignsTitle', Icon: Megaphone },
  { value: 'stores', label: 'SolutionStoresTitle', Icon: ShoppingBag },
] as const

export type SolutionId = (typeof SOLUTIONS)[number]['value']

interface Props {
  lng: string
  value: SolutionId[]
  onChange: (next: SolutionId[]) => void
}

/* Optional multi-select: any number of the solutions, tapping a chosen one clears it. */
export default function SolutionField({ lng, value, onChange }: Props) {
  const { t } = getClientTranslation(lng)
  const labelId = useId()

  // keeps the fixed order of the cards whatever order they were tapped in
  const toggle = (id: SolutionId) =>
    onChange(
      SOLUTIONS.map((x) => x.value).filter((x) =>
        x === id ? !value.includes(id) : value.includes(x)
      )
    )

  return (
    <div role="group" aria-labelledby={labelId} className={styles.root}>
      <div className={styles.head}>
        <span id={labelId} className={styles.title}>
          {t('ContactFormSolution')}
        </span>
        {!value.length && <span className={styles.hint}>{t('ContactFormSolutionHint')}</span>}
      </div>

      <div className={styles.grid}>
        {SOLUTIONS.map(({ value: id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={styles.tile}
            aria-pressed={value.includes(id)}
            onClick={() => toggle(id)}
          >
            <Icon className={styles.icon} aria-hidden />
            <span>{t(label)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
