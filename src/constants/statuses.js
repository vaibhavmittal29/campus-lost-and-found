import { Search, CheckCircle2, ShieldCheck } from 'lucide-react'

export const STATUSES = [
  {
    id: 'lost',
    label: 'Lost',
    icon: Search,
    bgColor: 'var(--color-lost-bg)',
    fgColor: 'var(--color-lost-fg)',
  },
  {
    id: 'found',
    label: 'Found',
    icon: CheckCircle2,
    bgColor: 'var(--color-found-bg)',
    fgColor: 'var(--color-found-fg)',
  },
  {
    id: 'claimed',
    label: 'Claimed',
    icon: ShieldCheck,
    bgColor: 'var(--color-claimed-bg)',
    fgColor: 'var(--color-claimed-fg)',
  },
]

export const getStatus = (id) => {
  return STATUSES.find((s) => s.id === id) || STATUSES[0]
}
