export type StudentStatus = 'active' | 'paused' | 'left'

export interface Student {
  id: string
  firstName: string
  lastName: string
  gender: 'm' | 'f'
  classId: string
  birthDate: string // ISO
  parentName: string
  parentPhone: string
  parentEmail: string
  enrolledAt: string // ISO
  status: StudentStatus
  avgScore: number // 2..5
  attendance: number // 0..100
  monthlyFee: number
  discount: number // %
  notes?: string
}

export interface Teacher {
  id: string
  name: string
  subjects: string[]
  experience: number // years
  phone: string
  email: string
  rating: number
  education: string
  bio: string
  color: string
}

export interface SchoolClass {
  id: string // e.g. "5А"
  grade: number
  letter: string
  curatorId: string
  room: string
}

export type LeadStatus = 'new' | 'contacted' | 'trial' | 'contract' | 'lost'

export interface Lead {
  id: string
  parentName: string
  childName: string
  phone: string
  grade: number
  source: string
  status: LeadStatus
  createdAt: string // ISO datetime
  manager: string
  comment: string
}

export type PaymentStatus = 'paid' | 'pending' | 'overdue'

export interface Payment {
  id: string
  studentId: string
  period: string // YYYY-MM
  amount: number
  status: PaymentStatus
  paidAt?: string
  method?: 'Карта' | 'Перевод' | 'Наличные' | 'Kaspi'
}

export interface Lesson {
  classId: string
  day: number // 0 = Пн .. 4 = Пт
  slot: number // 0..6
  subject: string
  teacherId: string
  room: string
}

export interface Review {
  name: string
  role: string
  text: string
  rating: number
}
