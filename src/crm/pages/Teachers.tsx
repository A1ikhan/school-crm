import { GraduationCap, Mail, Phone, Search, Star } from 'lucide-react'
import { useState } from 'react'
import { Avatar, Card, Input, PageHeader } from '../../components/ui'
import { useStore } from '../../store/store'

export default function Teachers() {
  const { teachers, lessons, classes } = useStore()
  const [q, setQ] = useState('')
  const list = teachers.filter((t) => `${t.name} ${t.subjects.join(' ')}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title="Педагоги" subtitle={`${teachers.length} сотрудников · нагрузка считается по текущему расписанию`} />
      <div className="relative mb-5 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input className="pl-9" placeholder="Имя или предмет" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((t) => {
          const load = lessons.filter((l) => l.teacherId === t.id).length
          const curated = classes.filter((c) => c.curatorId === t.id).map((c) => c.id)
          return (
            <Card key={t.id} className="flex flex-col p-5">
              <div className="flex items-start gap-4">
                <Avatar name={t.name.split(' ').filter((_, i) => i !== 1).join(' ')} color={t.color} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold leading-snug">{t.name}</div>
                  <div className="mt-1 text-sm text-indigo-600">{t.subjects.join(', ')}</div>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-500"><Star size={14} fill="currentColor" />{t.rating.toFixed(1)}</span>
              </div>
              <p className="mt-4 text-sm text-slate-600">{t.bio}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500"><GraduationCap size={14} /> {t.education}</div>
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center">
                <div><div className="font-bold">{t.experience}</div><div className="text-[11px] text-slate-500">лет стажа</div></div>
                <div><div className="font-bold">{load}</div><div className="text-[11px] text-slate-500">уроков/нед</div></div>
                <div><div className="font-bold">{curated.join(', ') || '—'}</div><div className="text-[11px] text-slate-500">кл. рук.</div></div>
              </div>
              <div className="mt-4 flex flex-col gap-1.5 border-t border-slate-100 pt-4 text-sm">
                <a href={`tel:${t.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600"><Phone size={14} /> {t.phone}</a>
                <a href={`mailto:${t.email}`} className="flex items-center gap-2 truncate text-slate-600 hover:text-indigo-600"><Mail size={14} /> {t.email}</a>
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}
