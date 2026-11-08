import { ArrowRight, DoorOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar, Card, PageHeader } from '../../components/ui'
import { money } from '../../lib'
import { useStore } from '../../store/store'

const LEVELS = [
  { title: 'Начальная школа', from: 1, to: 4 },
  { title: 'Основная школа', from: 5, to: 9 },
  { title: 'Старшая школа', from: 10, to: 11 },
]

export default function Classes() {
  const { classes, students, teachers, payments } = useStore()
  return (
    <>
      <PageHeader title="Классы" subtitle={`${classes.length} классов · средняя наполняемость ${Math.round(students.filter((s) => s.status === 'active').length / classes.length)} учеников`} />
      <div className="space-y-8">
        {LEVELS.map((lvl) => (
          <section key={lvl.title}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{lvl.title}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {classes.filter((c) => c.grade >= lvl.from && c.grade <= lvl.to).map((c) => {
                const kids = students.filter((s) => s.classId === c.id && s.status === 'active')
                const curator = teachers.find((t) => t.id === c.curatorId)!
                const avg = kids.filter((k) => k.avgScore).reduce((a, k) => a + k.avgScore, 0) / (kids.filter((k) => k.avgScore).length || 1)
                const ids = new Set(kids.map((k) => k.id))
                const debt = payments.filter((p) => ids.has(p.studentId) && p.status === 'overdue').reduce((a, p) => a + p.amount, 0)
                return (
                  <Card key={c.id} className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="text-3xl font-extrabold text-slate-900">{c.id}</div>
                      <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"><DoorOpen size={13} /> {c.room}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Avatar name={curator.name.split(' ').filter((_, i) => i !== 1).join(' ')} color={curator.color} size="sm" />
                      <div className="text-sm leading-tight">
                        <div className="font-medium">{curator.name.split(' ').slice(0, 2).join(' ')}</div>
                        <div className="text-xs text-slate-500">классный руководитель</div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="rounded-lg bg-slate-50 py-2"><div className="font-bold">{kids.length}</div><div className="text-[11px] text-slate-500">учеников</div></div>
                      <div className="rounded-lg bg-slate-50 py-2"><div className="font-bold">{avg.toFixed(1).replace('.', ',')}</div><div className="text-[11px] text-slate-500">ср. балл</div></div>
                      <div className="rounded-lg bg-slate-50 py-2"><div className={`font-bold ${debt ? 'text-rose-600' : ''}`}>{debt ? `${Math.round(debt / 1000)}к` : '0'}</div><div className="text-[11px] text-slate-500">долг</div></div>
                    </div>
                    {debt > 0 && <div className="sr-only">Долг {money(debt)}</div>}
                    <div className="mt-4 flex gap-3 text-sm">
                      <Link to={`/crm/students?class=${c.id}`} className="flex items-center gap-1 font-medium text-indigo-600 hover:underline">Ученики <ArrowRight size={14} /></Link>
                      <Link to={`/crm/schedule?class=${c.id}`} className="text-slate-500 hover:text-indigo-600">Расписание</Link>
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
