import type { LeadStatus, PaymentStatus, StudentStatus } from './types'

export const SCHOOL_NAME = 'Горизонт'
export const CURRENCY = '₸'
/** "Сегодня" для мокап-данных — чтобы демо выглядело одинаково в любой день. */
export const TODAY = new Date('2026-11-08T10:00:00')

export const LEAD_STATUSES: { id: LeadStatus; label: string; color: string; dot: string }[] = [
  { id: 'new', label: 'Новая заявка', color: 'bg-sky-50 text-sky-700 ring-sky-200', dot: 'bg-sky-500' },
  { id: 'contacted', label: 'Связались', color: 'bg-violet-50 text-violet-700 ring-violet-200', dot: 'bg-violet-500' },
  { id: 'trial', label: 'Пробный день', color: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-500' },
  { id: 'contract', label: 'Договор', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' },
  { id: 'lost', label: 'Отказ', color: 'bg-slate-100 text-slate-600 ring-slate-200', dot: 'bg-slate-400' },
]

export const PAYMENT_STATUSES: Record<PaymentStatus, { label: string; color: string }> = {
  paid: { label: 'Оплачено', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  pending: { label: 'Ожидает', color: 'bg-amber-50 text-amber-700 ring-amber-200' },
  overdue: { label: 'Просрочено', color: 'bg-rose-50 text-rose-700 ring-rose-200' },
}

export const STUDENT_STATUSES: Record<StudentStatus, { label: string; color: string }> = {
  active: { label: 'Учится', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  paused: { label: 'Пауза', color: 'bg-amber-50 text-amber-700 ring-amber-200' },
  left: { label: 'Выбыл', color: 'bg-slate-100 text-slate-600 ring-slate-200' },
}

export const LEAD_SOURCES = ['Сайт', 'Instagram', 'Рекомендация', '2ГИС', 'Звонок', 'День открытых дверей']
export const MANAGERS = ['Айгерим С.', 'Марина К.', 'Дана Ж.']

export const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница']
export const DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт']
export const SLOT_TIMES = ['08:30', '09:25', '10:30', '11:25', '12:30', '14:00', '14:55']

export function feeForGrade(grade: number) {
  if (grade <= 4) return 180_000
  if (grade <= 9) return 220_000
  return 250_000
}
