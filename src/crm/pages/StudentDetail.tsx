import { ArrowLeft, Cake, CalendarCheck, Mail, Phone, School, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar, Badge, Button, Card, Empty, Field, Input, Modal, Select, Textarea } from '../../components/ui'
import { PAYMENT_STATUSES, STUDENT_STATUSES } from '../../data/constants'
import type { Payment, Student } from '../../data/types'
import { PayModal } from '../../components/PayModal'
import { age, date, money, periodLabel } from '../../lib'
import { useStore } from '../../store/store'

// Мокап оценок по предметам — выводится из среднего балла ученика детерминированно
function subjectScores(s: Student) {
  const subjects = parseInt(s.classId) <= 4
    ?  ['Математика', 'Русский язык', 'Казахский язык', 'Английский язык', 'Познание мира']
    : ['Математика', 'Русский язык', 'Казахский язык', 'Английский язык', 'Физика', 'История', 'Информатика']
  const seed = [...s.id].reduce((a, c) => a + c.charCodeAt(0), 0)
  return subjects.map((name, i) => {
    const delta = (((seed * (i + 3)) % 11) - 5) / 10
    return { name, score: Math.min(5, Math.max(2.5, Math.round((s.avgScore + delta) * 10) / 10)) }
  })
}

export default function StudentDetail() {
  const { id } = useParams()
  const { students, classes, teachers, payments, updateStudent, markPaid } = useStore()
  const [editing, setEditing] = useState(false)
  const [paying, setPaying] = useState<Payment | null>(null)
  const s = students.find((x) => x.id === id)
  if (!s) return <Empty>Ученик не найден. <Link className="text-indigo-600" to="/crm/students">К списку</Link></Empty>

  const cls = classes.find((c) => c.id === s.classId)
  const curator = teachers.find((t) => t.id === cls?.curatorId)
  const own = payments.filter((p) => p.studentId === s.id).sort((a, b) => b.period.localeCompare(a.period))
  const debt = own.filter((p) => p.status !== 'paid').reduce((a, p) => a + p.amount, 0)
  const paid = own.filter((p) => p.status === 'paid').reduce((a, p) => a + p.amount, 0)

  return (
    <>
      <Link to="/crm/students" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600"><ArrowLeft size={16} /> Все ученики</Link>

      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar name={`${s.firstName} ${s.lastName}`} size="xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{s.lastName} {s.firstName}</h1>
              <Badge className={STUDENT_STATUSES[s.status].color}>{STUDENT_STATUSES[s.status].label}</Badge>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><School size={15} /> {s.classId} класс · кл. рук. {curator?.name.split(' ').slice(0, 2).join(' ')}</span>
              <span className="flex items-center gap-1.5"><Cake size={15} /> {date(s.birthDate)} ({age(s.birthDate)} лет)</span>
              <span className="flex items-center gap-1.5"><CalendarCheck size={15} /> в школе с {date(s.enrolledAt)}</span>
            </div>
          </div>
          <Button variant="secondary" onClick={() => setEditing(true)}>Редактировать</Button>
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-semibold">Родитель</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar name={s.parentName} />
              <div className="font-medium">{s.parentName}</div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <a href={`tel:${s.parentPhone}`} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600"><Phone size={15} /> {s.parentPhone}</a>
              {s.parentEmail && <a href={`mailto:${s.parentEmail}`} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600"><Mail size={15} /> {s.parentEmail}</a>}
            </div>
            {s.notes && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">{s.notes}</p>}
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold">Обучение</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-slate-500">Средний балл</dt><dd className="text-xl font-bold">{s.avgScore ? s.avgScore.toFixed(1).replace('.', ',') : '—'}</dd></div>
              <div><dt className="text-slate-500">Посещаемость</dt><dd className="text-xl font-bold">{s.attendance}%</dd></div>
              <div><dt className="text-slate-500">Тариф</dt><dd className="font-semibold">{money(s.monthlyFee)}</dd></div>
              <div><dt className="text-slate-500">Скидка</dt><dd className="font-semibold">{s.discount ? `${s.discount}%` : 'нет'}</dd></div>
            </dl>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          {s.avgScore > 0 && (
            <Card className="p-5">
              <h2 className="font-semibold">Успеваемость по предметам · 1 четверть</h2>
              <div className="mt-4 space-y-3">
                {subjectScores(s).map((x) => (
                  <div key={x.name} className="flex items-center gap-4 text-sm">
                    <span className="w-36 shrink-0 text-slate-600">{x.name}</span>
                    <div className="h-2 flex-1 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${(x.score / 5) * 100}%` }} />
                    </div>
                    <span className="w-8 text-right font-semibold tabular-nums">{x.score.toFixed(1).replace('.', ',')}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
              <h2 className="flex items-center gap-2 font-semibold"><Wallet size={16} /> Оплаты</h2>
              <div className="text-sm text-slate-500">
                Оплачено <span className="font-semibold text-slate-900">{money(paid)}</span>
                {debt > 0 && <> · к оплате <span className="font-semibold text-rose-600">{money(debt)}</span></>}
              </div>
            </div>
            <ul className="divide-y divide-slate-100">
              {own.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm">
                  <span className="w-32 font-medium">{periodLabel(p.period)}</span>
                  <span className="flex-1 tabular-nums">{money(p.amount)}</span>
                  <span className="text-xs text-slate-400">{p.paidAt ? `${date(p.paidAt)} · ${p.method}` : ''}</span>
                  <Badge className={PAYMENT_STATUSES[p.status].color}>{PAYMENT_STATUSES[p.status].label}</Badge>
                  {p.status !== 'paid' && <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => setPaying(p)}>Принять оплату</Button>}
                </li>
              ))}
            </ul>
            {!own.length && <Empty>Счетов пока нет</Empty>}
          </Card>
        </div>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Редактирование ученика" wide>
        <EditStudent student={s} onSave={(patch) => { updateStudent(s.id, patch); setEditing(false) }} />
      </Modal>
      <PayModal payment={paying} onClose={() => setPaying(null)} onPay={(m) => { markPaid(paying!.id, m); setPaying(null) }} />
    </>
  )
}

function EditStudent({ student, onSave }: { student: Student; onSave: (p: Partial<Student>) => void }) {
  const { classes } = useStore()
  const [f, setF] = useState(student)
  const set = <K extends keyof Student>(k: K, v: Student[K]) => setF({ ...f, [k]: v })
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(f) }} className="grid gap-4 sm:grid-cols-2">
      <Field label="Фамилия"><Input value={f.lastName} onChange={(e) => set('lastName', e.target.value)} /></Field>
      <Field label="Имя"><Input value={f.firstName} onChange={(e) => set('firstName', e.target.value)} /></Field>
      <Field label="Класс">
        <Select value={f.classId} onChange={(e) => set('classId', e.target.value)}>
          {classes.map((c) => <option key={c.id}>{c.id}</option>)}
        </Select>
      </Field>
      <Field label="Статус">
        <Select value={f.status} onChange={(e) => set('status', e.target.value as Student['status'])}>
          {Object.entries(STUDENT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </Select>
      </Field>
      <Field label="Родитель"><Input value={f.parentName} onChange={(e) => set('parentName', e.target.value)} /></Field>
      <Field label="Телефон родителя"><Input value={f.parentPhone} onChange={(e) => set('parentPhone', e.target.value)} /></Field>
      <Field label="Email родителя"><Input value={f.parentEmail} onChange={(e) => set('parentEmail', e.target.value)} /></Field>
      <Field label="Скидка, %">
        <Select value={f.discount} onChange={(e) => set('discount', Number(e.target.value))}>
          {[0, 10, 15, 20, 30, 50].map((d) => <option key={d} value={d}>{d}%</option>)}
        </Select>
      </Field>
      <Field label="Заметки" className="sm:col-span-2"><Textarea rows={3} value={f.notes ?? ''} onChange={(e) => set('notes', e.target.value)} /></Field>
      <div className="flex justify-end sm:col-span-2"><Button>Сохранить</Button></div>
    </form>
  )
}
