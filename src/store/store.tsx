import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as mock from '../data/mock'
import { TODAY } from '../data/constants'
import type { Lead, Payment, SchoolClass, Student, Teacher, Lesson } from '../data/types'
import { uid } from '../lib'

interface Data {
  students: Student[]
  teachers: Teacher[]
  classes: SchoolClass[]
  leads: Lead[]
  payments: Payment[]
  lessons: Lesson[]
}

interface Store extends Data {
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status' | 'manager'> & Partial<Pick<Lead, 'status' | 'manager'>>) => Lead
  updateLead: (id: string, patch: Partial<Lead>) => void
  deleteLead: (id: string) => void
  addStudent: (s: Omit<Student, 'id'>) => Student
  updateStudent: (id: string, patch: Partial<Student>) => void
  markPaid: (paymentId: string, method: Payment['method']) => void
  resetDemo: () => void
}

const KEY = 'horizon-crm-v1'
const initial = (): Data => ({
  students: mock.students,
  teachers: mock.teachers,
  classes: mock.classes,
  leads: mock.leads,
  payments: mock.payments,
  lessons: mock.lessons,
})

function load(): Data {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initial(), ...JSON.parse(raw) }
  } catch {
    /* хранилище недоступно — работаем на мокапе */
  }
  return initial()
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(load)

  useEffect(() => {
    try {
      // Учителя, классы и расписание статичны — сохраняем только то, что меняется.
      const { students, leads, payments } = data
      localStorage.setItem(KEY, JSON.stringify({ students, leads, payments }))
    } catch {
      /* ignore */
    }
  }, [data])

  const store = useMemo<Store>(
    () => ({
      ...data,
      addLead: (input) => {
        const lead: Lead = {
          status: 'new',
          manager: 'Не назначен',
          ...input,
          id: uid('l'),
          createdAt: new Date().toISOString(),
        }
        setData((d) => ({ ...d, leads: [lead, ...d.leads] }))
        return lead
      },
      updateLead: (id, patch) =>
        setData((d) => ({ ...d, leads: d.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),
      deleteLead: (id) => setData((d) => ({ ...d, leads: d.leads.filter((l) => l.id !== id) })),
      addStudent: (input) => {
        const student: Student = { ...input, id: uid('s') }
        const period = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}`
        const invoice: Payment = {
          id: uid('p'),
          studentId: student.id,
          period,
          amount: Math.round((student.monthlyFee * (100 - student.discount)) / 100),
          status: 'pending',
        }
        setData((d) => ({ ...d, students: [...d.students, student], payments: [...d.payments, invoice] }))
        return student
      },
      updateStudent: (id, patch) =>
        setData((d) => ({ ...d, students: d.students.map((s) => (s.id === id ? { ...s, ...patch } : s)) })),
      markPaid: (paymentId, method) =>
        setData((d) => ({
          ...d,
          payments: d.payments.map((p) =>
            p.id === paymentId ? { ...p, status: 'paid', method, paidAt: TODAY.toISOString().slice(0, 10) } : p,
          ),
        })),
      resetDemo: () => {
        try {
          localStorage.removeItem(KEY)
        } catch {
          /* ignore */
        }
        setData(initial())
      },
    }),
    [data],
  )

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}
