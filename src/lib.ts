import { CURRENCY, TODAY } from './data/constants'

export const money = (n: number) => `${new Intl.NumberFormat('ru-RU').format(n)} ${CURRENCY}`
export const moneyShort = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1).replace('.', ',')} млн ${CURRENCY}` : money(n)

const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']
export const periodLabel = (p: string) => {
  const [y, m] = p.split('-').map(Number)
  const name = MONTHS[m - 1]
  return `${name[0].toUpperCase()}${name.slice(1)} ${y}`
}
export const periodShort = (p: string) => MONTHS_SHORT[Number(p.split('-')[1]) - 1]

export const date = (iso: string) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export function relative(iso: string) {
  const days = Math.floor((TODAY.getTime() - new Date(iso).getTime()) / 86_400_000)
  if (days <= 0) return 'сегодня'
  if (days === 1) return 'вчера'
  if (days < 5) return `${days} дня назад`
  return `${days} дн. назад`
}

export function age(birthDate: string) {
  const b = new Date(birthDate)
  let a = TODAY.getFullYear() - b.getFullYear()
  if (TODAY.getMonth() < b.getMonth() || (TODAY.getMonth() === b.getMonth() && TODAY.getDate() < b.getDate())) a--
  return a
}

export const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

export const uid = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
