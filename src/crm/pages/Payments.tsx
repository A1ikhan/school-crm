import { CheckCircle2, Clock, Download, Search, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PayModal } from '../../components/PayModal'
import { Badge, Button, Card, Empty, Input, PageHeader, Select, StatCard } from '../../components/ui'
import { PAYMENT_STATUSES } from '../../data/constants'
import type { Payment, PaymentStatus } from '../../data/types'
import { date, money, moneyShort, periodLabel } from '../../lib'
import { useStore } from '../../store/store'

export default function Payments() {
  const { payments, students, markPaid } = useStore()
  const [params, setParams] = useSearchParams()
  const status = (params.get('status') ?? '') as PaymentStatus | ''
  const periods = [...new Set(payments.map((p) => p.period))].sort().reverse()
  const [period, setPeriod] = useState(status === 'overdue' ? '' : periods[0])
  const [q, setQ] = useState('')
  const [paying, setPaying] = useState<Payment | null>(null)
  const byId = new Map(students.map((s) => [s.id, s]))

  const inPeriod = payments.filter((p) => !period || p.period === period)
  const sum = (st: PaymentStatus) => inPeriod.filter((p) => p.status === st).reduce((a, p) => a + p.amount, 0)
  const list = inPeriod
    .filter((p) => !status || p.status === status)
    .filter((p) => {
      const s = byId.get(p.studentId)
      return s && `${s.lastName} ${s.firstName} ${s.parentName} ${s.classId}`.toLowerCase().includes(q.toLowerCase())
    })
    .sort((a, b) => b.period.localeCompare(a.period) || a.status.localeCompare(b.status))

  const exportCsv = () => {
    const rows = [['Период', 'Ученик', 'Класс', 'Сумма', 'Статус', 'Дата оплаты', 'Способ']]
    list.forEach((p) => {
      const s = byId.get(p.studentId)!
      rows.push([periodLabel(p.period), `${s.lastName} ${s.firstName}`, s.classId, String(p.amount), PAYMENT_STATUSES[p.status].label, p.paidAt ?? '', p.method ?? ''])
    })
    const blob = new Blob(['﻿' + rows.map((r) => r.map((c) => `"${c}"`).join(';')).join('\n')], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'payments.csv'
    a.click()
  }

  return (
    <>
      <PageHeader title="Оплаты" subtitle="Ежемесячные счета за обучение" actions={<Button variant="secondary" onClick={exportCsv}><Download size={16} /> Экспорт CSV</Button>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Оплачено" value={moneyShort(sum('paid'))} tone="emerald" icon={<CheckCircle2 size={18} />} hint={period ? periodLabel(period) : 'за всё время'} />
        <StatCard label="Ожидает оплаты" value={moneyShort(sum('pending'))} tone="amber" icon={<Clock size={18} />} hint={`${inPeriod.filter((p) => p.status === 'pending').length} счетов`} />
        <StatCard label="Просрочено" value={moneyShort(sum('overdue'))} tone="rose" icon={<TriangleAlert size={18} />} hint={`${inPeriod.filter((p) => p.status === 'overdue').length} счетов`} />
      </div>

      <div className="my-5 grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Ученик, родитель, класс" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="">Все месяцы</option>
          {periods.map((p) => <option key={p} value={p}>{periodLabel(p)}</option>)}
        </Select>
        <Select value={status} onChange={(e) => setParams(e.target.value ? { status: e.target.value } : {})}>
          <option value="">Все статусы</option>
          {Object.entries(PAYMENT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </Select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Ученик</th>
                <th className="px-4 py-3 font-medium">Период</th>
                <th className="px-4 py-3 text-right font-medium">Сумма</th>
                <th className="px-4 py-3 font-medium">Статус</th>
                <th className="px-4 py-3 font-medium">Оплата</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.slice(0, 200).map((p) => {
                const s = byId.get(p.studentId)!
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link to={`/crm/students/${s.id}`} className="font-medium hover:text-indigo-600">{s.lastName} {s.firstName}</Link>
                      <div className="text-xs text-slate-400">{s.classId} · {s.parentName}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{periodLabel(p.period)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums">{money(p.amount)}</td>
                    <td className="px-4 py-3"><Badge className={PAYMENT_STATUSES[p.status].color}>{PAYMENT_STATUSES[p.status].label}</Badge></td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{p.paidAt ? `${date(p.paidAt)} · ${p.method}` : '—'}</td>
                    <td className="px-4 py-3 text-right">
                      {p.status !== 'paid' && <Button variant="secondary" className="px-2.5 py-1 text-xs" onClick={() => setPaying(p)}>Принять</Button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!list.length && <Empty>Нет счетов по выбранным фильтрам</Empty>}
          {list.length > 200 && <div className="border-t border-slate-100 py-3 text-center text-xs text-slate-400">Показаны первые 200 из {list.length}. Уточните фильтр.</div>}
        </div>
      </Card>
      <PayModal payment={paying} onClose={() => setPaying(null)} onPay={(m) => { markPaid(paying!.id, m); setPaying(null) }} />
    </>
  )
}
