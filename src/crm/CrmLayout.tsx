import {
  BookOpenCheck, CalendarDays, CreditCard, ExternalLink, GraduationCap, Inbox, LayoutDashboard, LogOut, Menu, RotateCcw, School, Users, X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Avatar } from '../components/ui'
import { SCHOOL_NAME } from '../data/constants'
import { cx } from '../lib'
import { useStore } from '../store/store'

export default function CrmLayout() {
  const { leads, resetDemo } = useStore()
  const [open, setOpen] = useState(false)
  const newLeads = leads.filter((l) => l.status === 'new').length

  const items = [
    { to: '/crm', label: 'Дашборд', icon: LayoutDashboard, end: true },
    { to: '/crm/leads', label: 'Заявки', icon: Inbox, badge: newLeads },
    { to: '/crm/students', label: 'Ученики', icon: Users },
    { to: '/crm/classes', label: 'Классы', icon: School },
    { to: '/crm/teachers', label: 'Педагоги', icon: BookOpenCheck },
    { to: '/crm/schedule', label: 'Расписание', icon: CalendarDays },
    { to: '/crm/payments', label: 'Оплаты', icon: CreditCard },
  ]

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white"><GraduationCap size={20} /></div>
        <div className="leading-tight">
          <div className="font-bold text-white">{SCHOOL_NAME}</div>
          <div className="text-[11px] text-slate-400">CRM школы</div>
        </div>
      </div>
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {items.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cx('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition', isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white')
            }
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            {!!badge && <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[11px] font-semibold text-white">{badge}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white">
          <ExternalLink size={16} /> Сайт школы
        </Link>
        <button
          onClick={() => confirm('Сбросить все изменения и вернуть исходные демо-данные?') && resetDemo()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <RotateCcw size={16} /> Сбросить демо-данные
        </button>
        <div className="mt-2 flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <Avatar name="Айгерим Сапарова" size="sm" color="bg-indigo-500" />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-medium text-white">Айгерим Сапарова</div>
            <div className="text-[11px] text-slate-400">Администратор</div>
          </div>
          <Link to="/login" className="text-slate-400 hover:text-white" aria-label="Выйти"><LogOut size={16} /></Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-slate-900 lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-slate-900" onClick={(e) => (e.target as HTMLElement).closest('a') && setOpen(false)}>
            <button className="absolute right-3 top-4 p-1 text-slate-400" onClick={() => setOpen(false)} aria-label="Закрыть меню"><X size={20} /></button>
            {sidebar}
          </aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-lg p-1.5 hover:bg-slate-100" aria-label="Меню"><Menu size={20} /></button>
          <span className="font-semibold">{SCHOOL_NAME} CRM</span>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
