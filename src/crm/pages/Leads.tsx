import { Kanban, List, Phone, Plus, Search, Trash2, UserPlus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Badge, Button, Card, Empty, Field, Input, Modal, PageHeader, Select, Textarea } from '../../components/ui'
import { LEAD_SOURCES, LEAD_STATUSES, MANAGERS, TODAY, feeForGrade } from '../../data/constants'
import type { Lead, LeadStatus } from '../../data/types'
import { cx, dateTime, relative } from '../../lib'
import { useStore } from '../../store/store'

export default function Leads() {
  const { leads, updateLead } = useStore()
  const [view, setView] = useState<'board' | 'list'>('board')
  const [q, setQ] = useState('')
  const [source, setSource] = useState('')
  const [editing, setEditing] = useState<Lead | null>(null)
  const [creating, setCreating] = useState(false)
  const [dragOver, setDragOver] = useState<LeadStatus | null>(null)

  const filtered = leads.filter((l) => {
    const text = `${l.parentName} ${l.childName} ${l.phone}`.toLowerCase()
    return text.includes(q.toLowerCase()) && (!source || l.source === source)
  })

  return (
    <>
      <PageHeader
        title="Заявки"
        subtitle="Воронка набора: от первой заявки до договора. Перетаскивайте карточки между колонками."
        actions={<Button onClick={() => setCreating(true)}><Plus size={16} /> Новая заявка</Button>}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" placeholder="Поиск по имени или телефону" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select className="sm:w-56" value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">Все источники</option>
          {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
        </Select>
        <div className="flex rounded-lg bg-white p-1 ring-1 ring-slate-300">
          {([['board', Kanban, 'Доска'], ['list', List, 'Список']] as const).map(([v, Icon, label]) => (
            <button key={v} onClick={() => setView(v)} className={cx('flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm', view === v ? 'bg-indigo-600 text-white' : 'text-slate-600')}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </div>

      {view === 'board' ? (
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {LEAD_STATUSES.map((st) => {
            const items = filtered.filter((l) => l.status === st.id)
            return (
              <div
                key={st.id}
                onDragOver={(e) => { e.preventDefault(); setDragOver(st.id) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => {
                  e.preventDefault()
                  updateLead(e.dataTransfer.getData('text/plain'), { status: st.id })
                  setDragOver(null)
                }}
                className={cx('flex w-72 shrink-0 flex-col rounded-2xl bg-slate-100/80 p-3 transition', dragOver === st.id && 'bg-indigo-50 ring-2 ring-indigo-300')}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="flex items-center gap-2 text-sm font-semibold"><span className={cx('h-2 w-2 rounded-full', st.dot)} />{st.label}</span>
                  <span className="rounded-full bg-white px-2 text-xs font-medium text-slate-500">{items.length}</span>
                </div>
                <div className="flex-1 space-y-2.5">
                  {items.map((l) => (
                    <div
                      key={l.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', l.id)}
                      onClick={() => setEditing(l)}
                      className="cursor-pointer rounded-xl bg-white p-3.5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-semibold">{l.parentName}</div>
                        <span className="shrink-0 text-[11px] text-slate-400">{relative(l.createdAt)}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{l.childName} · {l.grade} класс</div>
                      {l.comment && <p className="mt-2 line-clamp-2 text-xs text-slate-600">{l.comment}</p>}
                      <div className="mt-3 flex items-center justify-between">
                        <Badge className="bg-slate-50 text-slate-600 ring-slate-200">{l.source}</Badge>
                        <span className="text-[11px] text-slate-400">{l.manager}</span>
                      </div>
                    </div>
                  ))}
                  {!items.length && <div className="rounded-xl border-2 border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">Перетащите сюда</div>}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Родитель</th>
                  <th className="px-4 py-3 font-medium">Ребёнок</th>
                  <th className="px-4 py-3 font-medium">Телефон</th>
                  <th className="px-4 py-3 font-medium">Источник</th>
                  <th className="px-4 py-3 font-medium">Статус</th>
                  <th className="px-4 py-3 font-medium">Менеджер</th>
                  <th className="px-4 py-3 font-medium">Создана</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((l) => {
                  const st = LEAD_STATUSES.find((s) => s.id === l.status)!
                  return (
                    <tr key={l.id} onClick={() => setEditing(l)} className="cursor-pointer hover:bg-slate-50">
                      <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar name={l.parentName} size="sm" /><span className="font-medium">{l.parentName}</span></div></td>
                      <td className="px-4 py-3 text-slate-600">{l.childName}, {l.grade} кл.</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{l.phone}</td>
                      <td className="px-4 py-3 text-slate-600">{l.source}</td>
                      <td className="px-4 py-3"><Badge className={st.color}>{st.label}</Badge></td>
                      <td className="px-4 py-3 text-slate-600">{l.manager}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">{dateTime(l.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {!filtered.length && <Empty>Заявок не найдено</Empty>}
          </div>
        </Card>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Новая заявка">
        <LeadForm onDone={() => setCreating(false)} />
      </Modal>
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Карточка заявки">
        {editing && <LeadForm key={editing.id} lead={leads.find((l) => l.id === editing.id) ?? editing} onDone={() => setEditing(null)} />}
      </Modal>
    </>
  )
}

function LeadForm({ lead, onDone }: { lead?: Lead; onDone: () => void }) {
  const { addLead, updateLead, deleteLead, addStudent, classes } = useStore()
  const nav = useNavigate()
  const [f, setF] = useState({
    parentName: lead?.parentName ?? '',
    childName: lead?.childName ?? '',
    phone: lead?.phone ?? '',
    grade: lead?.grade ?? 1,
    source: lead?.source ?? 'Звонок',
    status: lead?.status ?? ('new' as LeadStatus),
    manager: lead?.manager ?? MANAGERS[0],
    comment: lead?.comment ?? '',
  })
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF({ ...f, [k]: v })

  const save = (e: FormEvent) => {
    e.preventDefault()
    if (lead) updateLead(lead.id, f)
    else addLead(f)
    onDone()
  }

  const enroll = () => {
    const cls = classes.find((c) => c.grade === f.grade) ?? classes[0]
    const [firstName, ...rest] = f.childName.trim().split(/\s+/)
    const lastName = rest.join(' ') || f.parentName.split(' ').slice(1).join(' ')
    const student = addStudent({
      firstName,
      lastName,
      gender: /а$|я$/.test(firstName) ? 'f' : 'm',
      classId: cls.id,
      birthDate: `${TODAY.getFullYear() - f.grade - 6}-09-01`,
      parentName: f.parentName,
      parentPhone: f.phone,
      parentEmail: '',
      enrolledAt: TODAY.toISOString().slice(0, 10),
      status: 'active',
      avgScore: 0,
      attendance: 100,
      monthlyFee: feeForGrade(f.grade),
      discount: 0,
      notes: f.comment,
    })
    if (lead) updateLead(lead.id, { ...f, status: 'contract' })
    onDone()
    nav(`/crm/students/${student.id}`)
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Родитель"><Input required value={f.parentName} onChange={(e) => set('parentName', e.target.value)} /></Field>
        <Field label="Ребёнок (имя и фамилия)"><Input required value={f.childName} onChange={(e) => set('childName', e.target.value)} /></Field>
        <Field label="Телефон">
          <div className="flex gap-2">
            <Input required value={f.phone} onChange={(e) => set('phone', e.target.value)} />
            {lead && <a href={`tel:${f.phone}`} className="grid place-items-center rounded-lg px-3 text-indigo-600 ring-1 ring-slate-300 hover:bg-indigo-50" aria-label="Позвонить"><Phone size={16} /></a>}
          </div>
        </Field>
        <Field label="Класс">
          <Select value={f.grade} onChange={(e) => set('grade', Number(e.target.value))}>
            {Array.from({ length: 11 }, (_, i) => <option key={i} value={i + 1}>{i + 1} класс</option>)}
          </Select>
        </Field>
        <Field label="Источник">
          <Select value={f.source} onChange={(e) => set('source', e.target.value)}>
            {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Ответственный">
          <Select value={f.manager} onChange={(e) => set('manager', e.target.value)}>
            {[...MANAGERS, 'Не назначен'].map((m) => <option key={m}>{m}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="Статус">
        <div className="flex flex-wrap gap-2">
          {LEAD_STATUSES.map((s) => (
            <button type="button" key={s.id} onClick={() => set('status', s.id)} className={cx('rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset', f.status === s.id ? s.color + ' ring-2' : 'text-slate-500 ring-slate-200')}>
              {s.label}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Комментарий"><Textarea rows={3} value={f.comment} onChange={(e) => set('comment', e.target.value)} /></Field>
      {lead && <p className="text-xs text-slate-400">Создана {dateTime(lead.createdAt)}</p>}

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
        {lead && (
          <Button type="button" variant="ghost" className="text-rose-600 hover:bg-rose-50" onClick={() => { if (confirm('Удалить заявку?')) { deleteLead(lead.id); onDone() } }}>
            <Trash2 size={16} /> Удалить
          </Button>
        )}
        <div className="flex-1" />
        {lead && lead.status !== 'lost' && (
          <Button type="button" variant="secondary" onClick={enroll}><UserPlus size={16} /> Зачислить в ученики</Button>
        )}
        <Button>{lead ? 'Сохранить' : 'Создать заявку'}</Button>
      </div>
    </form>
  )
}
