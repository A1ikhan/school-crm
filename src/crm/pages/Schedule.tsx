import { useSearchParams } from 'react-router-dom'
import { Card, PageHeader, Select } from '../../components/ui'
import { DAYS, DAYS_SHORT, SLOT_TIMES } from '../../data/constants'
import { cx } from '../../lib'
import { useStore } from '../../store/store'

const SUBJECT_COLORS: Record<string, string> = {
  'Математика': 'bg-indigo-50 text-indigo-800 ring-indigo-200', 'Алгебра': 'bg-indigo-50 text-indigo-800 ring-indigo-200', 'Геометрия': 'bg-indigo-50 text-indigo-800 ring-indigo-200',
  'Английский язык': 'bg-rose-50 text-rose-800 ring-rose-200', 'Казахский язык': 'bg-amber-50 text-amber-800 ring-amber-200',
  'Русский язык': 'bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-200', 'Литература': 'bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-200', 'Литературное чтение': 'bg-fuchsia-50 text-fuchsia-800 ring-fuchsia-200',
  'Физика': 'bg-sky-50 text-sky-800 ring-sky-200', 'Информатика': 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  'Химия': 'bg-teal-50 text-teal-800 ring-teal-200', 'Биология': 'bg-teal-50 text-teal-800 ring-teal-200',
  'Физкультура': 'bg-lime-50 text-lime-800 ring-lime-200',
}

export default function Schedule() {
  const { classes, lessons, teachers } = useStore()
  const [params, setParams] = useSearchParams()
  const mode = params.get('teacher') ? 'teacher' : 'class'
  const classId = params.get('class') ?? '7А'
  const teacherId = params.get('teacher') ?? ''

  const items = mode === 'class' ? lessons.filter((l) => l.classId === classId) : lessons.filter((l) => l.teacherId === teacherId)
  const tName = (id: string) => {
    const t = teachers.find((x) => x.id === id)
    if (!t) return ''
    const [last, first, middle] = [t.name.split(' ')[2], t.name.split(' ')[0], t.name.split(' ')[1]]
    return `${last} ${first[0]}. ${middle[0]}.`
  }

  return (
    <>
      <PageHeader
        title="Расписание"
        subtitle="Неделя 9–13 ноября 2026"
        actions={
          <>
            <Select value={mode === 'class' ? classId : ''} onChange={(e) => setParams({ class: e.target.value })} className="sm:w-40">
              {mode === 'teacher' && <option value="">Класс…</option>}
              {classes.map((c) => <option key={c.id} value={c.id}>{c.id} класс</option>)}
            </Select>
            <Select value={teacherId} onChange={(e) => setParams(e.target.value ? { teacher: e.target.value } : { class: '7А' })} className="sm:w-72">
              <option value="">По педагогу…</option>
              {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </>
        }
      />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500">
                <th className="w-20 px-3 py-3 text-left font-medium">Время</th>
                {DAYS.map((d, i) => (
                  <th key={d} className="px-2 py-3 text-left font-medium"><span className="hidden md:inline">{d}</span><span className="md:hidden">{DAYS_SHORT[i]}</span></th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SLOT_TIMES.map((time, slot) => (
                <tr key={time}>
                  <td className="px-3 py-2 align-top">
                    <div className="font-semibold tabular-nums">{time}</div>
                    <div className="text-[11px] text-slate-400">{slot + 1} урок</div>
                  </td>
                  {DAYS.map((_, day) => {
                    const ls = items.filter((l) => l.day === day && l.slot === slot)
                    return (
                      <td key={day} className="px-1.5 py-1.5 align-top">
                        {ls.map((l) => (
                          <div key={l.classId} className={cx('mb-1 rounded-lg px-2.5 py-2 ring-1 ring-inset last:mb-0', SUBJECT_COLORS[l.subject] ?? 'bg-slate-50 text-slate-800 ring-slate-200')}>
                            <div className="truncate font-medium">{mode === 'teacher' ? `${l.classId} · ${l.subject}` : l.subject}</div>
                            <div className="truncate text-[11px] opacity-75">{mode === 'class' ? tName(l.teacherId) : ''}{mode === 'class' ? ' · ' : ''}{l.room}</div>
                          </div>
                        ))}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {mode === 'teacher' && <p className="mt-3 text-sm text-slate-500">Всего {items.length} уроков в неделю</p>}
    </>
  )
}
