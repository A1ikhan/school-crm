import { Download, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Avatar, Badge, Button, Card, Empty, Input, PageHeader, Select } from '../../components/ui'
import { STUDENT_STATUSES } from '../../data/constants'
import type { StudentStatus } from '../../data/types'
import { cx, money } from '../../lib'
import { useStore } from '../../store/store'

export default function Students() {
  const { students, classes, payments } = useStore()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const cls = params.get('class') ?? ''
  const [status, setStatus] = useState<StudentStatus | ''>('')
  const [sort, setSort] = useState<'name' | 'score' | 'attendance'>('name')

  const debtBy = useMemo(() => {
    const m = new Map<string, number>()
    for (const p of payments) if (p.status === 'overdue') m.set(p.studentId, (m.get(p.studentId) ?? 0) + p.amount)
    return m
  }, [payments])

  const list = students
    .filter((s) => `${s.lastName} ${s.firstName} ${s.parentName}`.toLowerCase().includes(q.toLowerCase()))
    .filter((s) => !cls || s.classId === cls)
    .filter((s) => !status || s.status === status)
    .sort((a, b) =>
      sort === 'score' ? b.avgScore - a.avgScore : sort === 'attendance' ? b.attendance - a.attendance : `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`, 'ru'),
    )

  const exportCsv = () => {
    const rows = [['Фамилия', 'Имя', 'Класс', 'Родитель', 'Телефон', 'Средний балл', 'Посещаемость', 'Статус']]
    list.forEach((s) => rows.push([s.lastName, s.firstName, s.classId, s.parentName, s.parentPhone, String(s.avgScore), `${s.attendance}%`, STUDENT_STATUSES[s.status].label]))
    const blob = new Blob(['﻿' + rows.map((r) => r.map((c) => `"${c}"`).join(';')).join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'students.csv'
    a.click()
  }

  return (
    <>
      <PageHeader
        title="Ученики"
        subtitle={`${students.filter((s) => s.status === 'active').length} учатся сейчас · всего в базе ${students.length}`}
        actions={<Button variant="secondary" onClick={exportCsv}><Download size={16} /> Экспорт CSV</Button>}
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Поиск: ученик или родитель" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={cls} onChange={(e) => setParams(e.target.value ? { class: e.target.value } : {})}>
          <option value="">Все классы</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.id} класс</option>)}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value as StudentStatus | '')}>
          <option value="">Любой статус</option>
          {Object.entries(STUDENT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
          <option value="name">По фамилии</option>
          <option value="score">По успеваемости</option>
          <option value="attendance">По посещаемости</option>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Ученик</th>
                <th className="px-4 py-3 font-medium">Класс</th>
                <th className="px-4 py-3 font-medium">Родитель</th>
                <th className="px-4 py-3 text-right font-medium">Ср. балл</th>
                <th className="px-4 py-3 text-right font-medium">Посещ.</th>
                <th className="px-4 py-3 text-right font-medium">Долг</th>
                <th className="px-4 py-3 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((s) => {
                const debt = debtBy.get(s.id) ?? 0
                return (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link to={`/crm/students/${s.id}`} className="flex items-center gap-3">
                        <Avatar name={`${s.firstName} ${s.lastName}`} size="sm" />
                        <span className="font-medium text-slate-900 hover:text-indigo-600">{s.lastName} {s.firstName}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3"><span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold">{s.classId}</span></td>
                    <td className="px-4 py-3">
                      <div className="text-slate-700">{s.parentName}</div>
                      <div className="text-xs text-slate-400">{s.parentPhone}</div>
                    </td>
                    <td className={cx('px-4 py-3 text-right font-medium tabular-nums', s.avgScore >= 4.5 ? 'text-emerald-600' : s.avgScore < 3.8 && s.avgScore > 0 ? 'text-amber-600' : '')}>
                      {s.avgScore ? s.avgScore.toFixed(1).replace('.', ',') : '—'}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600">{s.attendance}%</td>
                    <td className={cx('whitespace-nowrap px-4 py-3 text-right tabular-nums', debt ? 'font-medium text-rose-600' : 'text-slate-300')}>{debt ? money(debt) : '—'}</td>
                    <td className="px-4 py-3"><Badge className={STUDENT_STATUSES[s.status].color}>{STUDENT_STATUSES[s.status].label}</Badge></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!list.length && <Empty>Никого не нашли — попробуйте изменить фильтры</Empty>}
        </div>
      </Card>
    </>
  )
}
