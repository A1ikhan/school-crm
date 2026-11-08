import { AlertCircle, ArrowRight, CreditCard, Inbox, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Avatar, Badge, Card, PageHeader, StatCard } from '../../components/ui'
import { LEAD_STATUSES, SLOT_TIMES, TODAY } from '../../data/constants'
import { money, moneyShort, periodLabel, periodShort, relative } from '../../lib'
import { useStore } from '../../store/store'

const CURRENT = '2026-11'

export default function Dashboard() {
  const { students, leads, payments, teachers, lessons } = useStore()
  const active = students.filter((s) => s.status === 'active')
  const byId = new Map(students.map((s) => [s.id, s]))

  const current = payments.filter((p) => p.period === CURRENT)
  const collected = current.filter((p) => p.status === 'paid').reduce((a, p) => a + p.amount, 0)
  const expected = current.reduce((a, p) => a + p.amount, 0)
  const debt = payments.filter((p) => p.status !== 'paid').reduce((a, p) => a + p.amount, 0)
  const debtors = new Set(payments.filter((p) => p.status === 'overdue').map((p) => p.studentId))

  const month = leads.filter((l) => TODAY.getTime() - new Date(l.createdAt).getTime() < 30 * 86_400_000)
  const won = leads.filter((l) => l.status === 'contract').length
  const closed = leads.filter((l) => l.status === 'contract' || l.status === 'lost').length

  const periods = [...new Set(payments.map((p) => p.period))].sort()
  const revenue = periods.map((period) => ({
    period,
    label: periodShort(period),
    value: payments.filter((p) => p.period === period && p.status === 'paid').reduce((a, p) => a + p.amount, 0),
  }))

  const funnel = LEAD_STATUSES.map((s) => ({ ...s, count: leads.filter((l) => l.status === s.id).length }))
  const maxFunnel = Math.max(...funnel.map((f) => f.count), 1)

  const avgScore = active.reduce((a, s) => a + s.avgScore, 0) / (active.length || 1)
  const avgAttendance = active.reduce((a, s) => a + s.attendance, 0) / (active.length || 1)

  const overdue = payments
    .filter((p) => p.status === 'overdue')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  // Сегодня воскресенье в демо — показываем расписание на понедельник
  const mondayLessons = lessons.filter((l) => l.day === 0 && l.classId === '7А')

  return (
    <>
      <PageHeader title="Добрый день, Айгерим 👋" subtitle={`Сводка на ${TODAY.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Учеников сейчас" value={String(active.length)} icon={<Users size={18} />} hint={`${teachers.length} педагогов · ${(active.length / 12).toFixed(1)} в классе в среднем`} />
        <StatCard
          label={`Собрано за ${periodLabel(CURRENT).toLowerCase()}`}
          value={moneyShort(collected)}
          tone="emerald"
          icon={<TrendingUp size={18} />}
          hint={`${Math.round((collected / (expected || 1)) * 100)}% от плана ${moneyShort(expected)}`}
        />
        <StatCard label="Задолженность" value={moneyShort(debt)} tone="rose" icon={<CreditCard size={18} />} hint={`${debtors.size} учеников с просрочкой`} />
        <StatCard label="Заявок за 30 дней" value={String(month.length)} tone="amber" icon={<Inbox size={18} />} hint={`Конверсия в договор — ${Math.round((won / (closed || 1)) * 100)}%`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-baseline justify-between">
            <h2 className="font-semibold">Поступления по месяцам</h2>
            <span className="text-xs text-slate-500">оплаченные счета, 2026</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue} margin={{ left: -8, right: 4, top: 8 }} barCategoryGap="28%">
                <CartesianGrid vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v: number) => `${Math.round(v / 1_000_000)} млн`} />
                <Tooltip
                  cursor={{ fill: '#eef2ff' }}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                  formatter={(v) => [money(Number(v)), 'Поступило']}
                  labelFormatter={(_, p) => (p?.[0] ? periodLabel(p[0].payload.period) : '')}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Воронка заявок</h2>
            <Link to="/crm/leads" className="text-xs font-medium text-indigo-600 hover:underline">Все заявки →</Link>
          </div>
          <div className="mt-5 space-y-4">
            {funnel.map((f) => (
              <div key={f.id} title={`${f.label}: ${f.count}`}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-600"><span className={`h-2 w-2 rounded-full ${f.dot}`} />{f.label}</span>
                  <span className="font-semibold tabular-nums">{f.count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${(f.count / maxFunnel) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-center">
            <div>
              <div className="text-xl font-bold">{avgScore.toFixed(2).replace('.', ',')}</div>
              <div className="text-xs text-slate-500">средний балл</div>
            </div>
            <div>
              <div className="text-xl font-bold">{Math.round(avgAttendance)}%</div>
              <div className="text-xs text-slate-500">посещаемость</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold">Последние заявки</h2>
            <Link to="/crm/leads" className="text-slate-400 hover:text-indigo-600"><ArrowRight size={18} /></Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {leads.slice(0, 5).map((l) => {
              const st = LEAD_STATUSES.find((s) => s.id === l.status)!
              return (
                <li key={l.id} className="flex items-center gap-3 px-5 py-3">
                  <Avatar name={l.parentName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{l.parentName}</div>
                    <div className="truncate text-xs text-slate-500">{l.childName} · {l.grade} кл. · {relative(l.createdAt)}</div>
                  </div>
                  <Badge className={st.color}>{st.label}</Badge>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-semibold"><AlertCircle size={16} className="text-rose-500" /> Просроченные оплаты</h2>
            <Link to="/crm/payments?status=overdue" className="text-slate-400 hover:text-indigo-600"><ArrowRight size={18} /></Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {overdue.map((p) => {
              const s = byId.get(p.studentId)
              if (!s) return null
              return (
                <li key={p.id}>
                  <Link to={`/crm/students/${s.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{s.lastName} {s.firstName}</div>
                      <div className="text-xs text-slate-500">{s.classId} · {periodLabel(p.period)}</div>
                    </div>
                    <span className="text-sm font-semibold text-rose-600 tabular-nums">{money(p.amount)}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold">Завтра · 7А</h2>
            <Link to="/crm/schedule" className="text-slate-400 hover:text-indigo-600"><ArrowRight size={18} /></Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {mondayLessons.map((l) => (
              <li key={l.slot} className="flex items-center gap-4 px-5 py-2.5">
                <span className="w-11 text-sm font-semibold text-indigo-600 tabular-nums">{SLOT_TIMES[l.slot]}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{l.subject}</div>
                  <div className="truncate text-xs text-slate-500">{teachers.find((t) => t.id === l.teacherId)?.name}</div>
                </div>
                <span className="text-xs text-slate-400">{l.room}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
