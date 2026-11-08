import {
  ArrowRight, BookOpen, Brain, Bus, CheckCircle2, ChevronDown, Clock, FlaskConical, Globe2, GraduationCap, HeartHandshake,
  Mail, MapPin, Menu, Phone, Shield, Sparkles, Star, Users, Utensils, X,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/ui'
import { SCHOOL_NAME, feeForGrade } from '../data/constants'
import { reviews } from '../data/mock'
import { cx, money } from '../lib'
import { useStore } from '../store/store'

const NAV = [
  ['О школе', '#about'],
  ['Программы', '#programs'],
  ['Педагоги', '#teachers'],
  ['Стоимость', '#pricing'],
  ['Отзывы', '#reviews'],
  ['Контакты', '#contact'],
]

export default function Landing() {
  return (
    <div className="bg-white">
      <Header />
      <Hero />
      <Stats />
      <About />
      <Programs />
      <DayTimeline />
      <TeachersSection />
      <Pricing />
      <Reviews />
      <Faq />
      <Contact />
      <Footer />
    </div>
  )
}

function Logo({ light }: { light?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white">
        <GraduationCap size={20} />
      </div>
      <div className="leading-tight">
        <div className={cx('font-bold', light ? 'text-white' : 'text-slate-900')}>{SCHOOL_NAME}</div>
        <div className={cx('text-[11px]', light ? 'text-slate-400' : 'text-slate-500')}>частная школа</div>
      </div>
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-indigo-600">{label}</a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Вход в CRM</Link>
          <a href="#contact" className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
            Записаться на экскурсию
          </a>
        </div>
        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Меню">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block py-2 text-slate-700">{label}</a>
          ))}
          <Link to="/login" className="block py-2 font-medium text-indigo-600">Вход в CRM →</Link>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_#e0e7ff,_transparent_55%),radial-gradient(ellipse_at_bottom_left,_#fef3c7,_transparent_50%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-100">
            <Sparkles size={14} /> Идёт набор на 2027/2028 учебный год
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Школа, где каждого ребёнка <span className="text-indigo-600">знают по имени</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600">
            Частная школа «{SCHOOL_NAME}» с 1 по 11 класс: классы до 14 человек, трёхъязычие, сильная математика и
            подготовка к ЕНТ, IELTS и поступлению в зарубежные вузы.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">
              Записаться на пробный день <ArrowRight size={18} />
            </a>
            <a href="#programs" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">
              Программы обучения
            </a>
          </div>
          <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
            <div className="flex -space-x-2">
              {['Динара К', 'Алексей П', 'Жанар Н', 'Ольга С'].map((n) => (
                <div key={n} className="rounded-full ring-2 ring-white"><Avatar name={n} size="sm" /></div>
              ))}
            </div>
            <div>
              <div className="flex text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}</div>
              4.9 — средняя оценка родителей
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden sm:aspect-[4/3.4] rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 p-8 text-white shadow-2xl">
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="flex items-center justify-between text-sm text-indigo-100">
                <span>Расписание 7А · Понедельник</span>
                <span>08:30</span>
              </div>
              <div className="space-y-3">
                {[
                  ['08:30', 'Математика', 'Гульмира Аскаровна'],
                  ['09:25', 'Английский язык', 'Анна Сергеевна'],
                  ['10:30', 'Информатика · Python', 'Арман Нурланович'],
                  ['11:25', 'Казахский язык', 'Жанна Ерболовна'],
                ].map(([t, s, who], i) => (
                  <div key={t} className={cx('flex items-center gap-4 rounded-2xl px-4 py-3', i === 0 ? 'bg-white text-slate-900' : 'bg-white/10')}>
                    <span className={cx('text-sm font-semibold', i === 0 ? 'text-indigo-600' : 'text-indigo-200')}>{t}</span>
                    <div>
                      <div className="font-semibold">{s}</div>
                      <div className={cx('text-xs', i === 0 ? 'text-slate-500' : 'text-indigo-200')}>{who}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-white/15 px-3 py-1">12 учеников</span>
                <span className="rounded-full bg-white/15 px-3 py-1">Кабинет 203</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-4 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-100 sm:block">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 /></div>
              <div>
                <div className="text-sm font-semibold">Средний балл ЕНТ — 118</div>
                <div className="text-xs text-slate-500">выпуск 2026 года</div>
              </div>
            </div>
          </div>
          <div className="absolute -right-3 -top-5 hidden rounded-2xl bg-white p-4 shadow-xl ring-1 ring-slate-100 sm:block">
            <div className="text-2xl font-bold text-indigo-600">IELTS 7.0+</div>
            <div className="text-xs text-slate-500">у 64% выпускников</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stats() {
  const { students, teachers } = useStore()
  const active = students.filter((s) => s.status === 'active').length
  const items = [
    [`${active}`, 'учеников'],
    [`${teachers.length}`, 'педагогов-предметников'],
    ['12', 'человек — средний размер класса'],
    ['98%', 'выпускников поступают на грант или за рубеж'],
  ]
  return (
    <section className="border-y border-slate-100 bg-slate-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
        {items.map(([v, l]) => (
          <div key={l} className="text-center">
            <div className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{v}</div>
            <div className="mt-1 text-sm text-slate-500">{l}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-sm font-semibold uppercase tracking-wider text-indigo-600">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-slate-600">{text}</p>}
    </div>
  )
}

function About() {
  const features = [
    { icon: Users, title: 'Маленькие классы', text: 'До 14 учеников. Учитель успевает уделить внимание каждому и видит пробелы сразу.' },
    { icon: Globe2, title: 'Трёхъязычие', text: 'Казахский, русский и английский с 1 класса. С 8 класса — часть предметов на английском.' },
    { icon: Brain, title: 'Индивидуальный план', text: 'Каждую четверть — диагностика и персональная траектория по ключевым предметам.' },
    { icon: FlaskConical, title: 'STEM-лаборатории', text: 'Робототехника, химическая и IT-лаборатория, 3D-печать и собственный хакатон.' },
    { icon: HeartHandshake, title: 'Психолог и тьютор', text: 'Сопровождение адаптации, профориентация и регулярные встречи с родителями.' },
    { icon: Shield, title: 'Безопасность', text: 'Охраняемая территория, пропускная система, медкабинет и видеонаблюдение.' },
  ]
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionTitle eyebrow="О школе" title="Почему родители выбирают «Горизонт»" text="Мы соединяем сильную академическую программу с заботой о каждом ребёнке — без перегрузки и стресса." />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Icon size={22} /></div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const PROGRAMS = [
  { grades: '1–4 класс', title: 'Начальная школа', grade: 1, color: 'from-amber-400 to-orange-500', points: ['Мягкая адаптация и игровые форматы', 'Английский 5 раз в неделю', 'Продлёнка с кружками до 18:00', 'Шахматы, робототехника, рисование'] },
  { grades: '5–9 класс', title: 'Основная школа', grade: 5, color: 'from-indigo-500 to-violet-600', points: ['Углублённая математика и информатика', 'Проектная деятельность', 'Олимпиадная подготовка', 'Профориентация с 8 класса'] },
  { grades: '10–11 класс', title: 'Старшая школа', grade: 10, color: 'from-emerald-500 to-teal-600', points: ['Профили: физмат, IT, био-хим, гуманитарный', 'Подготовка к ЕНТ и IELTS/SAT', 'Консультант по поступлению', 'Стажировки у партнёров'] },
]

function Programs() {
  return (
    <section id="programs" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle eyebrow="Программы" title="Обучение с 1 по 11 класс" text="Государственный стандарт РК плюс авторские курсы. Аттестат государственного образца." />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <div key={p.title} className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className={cx('bg-gradient-to-br p-6 text-white', p.color)}>
                <div className="text-sm font-medium opacity-90">{p.grades}</div>
                <div className="mt-1 text-2xl font-bold">{p.title}</div>
              </div>
              <ul className="flex-1 space-y-3 p-6">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-3 text-sm text-slate-700">
                    <CheckCircle2 size={18} className="shrink-0 text-emerald-500" /> {pt}
                  </li>
                ))}
              </ul>
              <div className="border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
                от <span className="font-semibold text-slate-900">{money(feeForGrade(p.grade))}</span> / месяц
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function DayTimeline() {
  const day = [
    ['08:00', 'Утренний сбор и завтрак', Utensils],
    ['08:30', 'Основные уроки', BookOpen],
    ['13:00', 'Обед и прогулка', Utensils],
    ['14:00', 'Самоподготовка с педагогом', Clock],
    ['15:30', 'Кружки и секции', Sparkles],
    ['18:00', 'Развоз по городу', Bus],
  ] as const
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionTitle eyebrow="Полный день" title="Один день в школе" text="Ребёнок возвращается домой с выполненными уроками и без лишних поездок по кружкам." />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {day.map(([time, title, Icon]) => (
          <div key={time} className="rounded-2xl border border-slate-200 p-5">
            <Icon className="text-indigo-600" size={22} />
            <div className="mt-3 text-sm font-bold text-indigo-600">{time}</div>
            <div className="mt-1 text-sm font-medium text-slate-800">{title}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function TeachersSection() {
  const { teachers } = useStore()
  return (
    <section id="teachers" className="bg-slate-900 py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Педагоги</div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Учителя, к которым хочется идти</h2>
          <p className="mt-4 text-slate-400">Средний стаж — 15 лет. Каждый год проходят международное повышение квалификации.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.slice(0, 8).map((t) => (
            <div key={t.id} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
              <Avatar name={t.name.split(' ').filter((_, i) => i !== 1).join(' ')} color={t.color} size="lg" />
              <div className="mt-4 font-semibold">{t.name}</div>
              <div className="mt-1 text-sm text-indigo-300">{t.subjects.join(', ')}</div>
              <p className="mt-3 text-sm text-slate-400">{t.bio}</p>
              <div className="mt-4 text-xs text-slate-500">Стаж {t.experience} лет</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const plans = [
    { name: 'Начальная школа', grade: 1, popular: false, extras: ['Полный день до 18:00', 'Питание 4 раза в день', 'Кружки включены'] },
    { name: 'Основная школа', grade: 5, popular: true, extras: ['Полный день до 18:00', 'Питание 3 раза в день', 'Олимпиадные группы', 'Кружки включены'] },
    { name: 'Старшая школа', grade: 10, popular: false, extras: ['Профильные группы', 'Подготовка к ЕНТ / IELTS', 'Консультант по поступлению'] },
  ]
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionTitle eyebrow="Стоимость" title="Прозрачные условия" text="Вступительный взнос — 300 000 ₸ (один раз). Скидка 10% на второго ребёнка и 15% при оплате за год." />
      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={cx('relative rounded-3xl p-8', p.popular ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'ring-1 ring-slate-200')}>
            {p.popular && <span className="absolute -top-3 left-8 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-900">Выбирают чаще</span>}
            <div className={cx('font-semibold', p.popular ? 'text-indigo-100' : 'text-slate-500')}>{p.name}</div>
            <div className="mt-4 text-4xl font-extrabold">{money(feeForGrade(p.grade))}</div>
            <div className={cx('text-sm', p.popular ? 'text-indigo-200' : 'text-slate-500')}>в месяц, 9 месяцев в году</div>
            <ul className="mt-6 space-y-3">
              {p.extras.map((e) => (
                <li key={e} className="flex gap-3 text-sm">
                  <CheckCircle2 size={18} className={p.popular ? 'text-amber-300' : 'text-emerald-500'} /> {e}
                </li>
              ))}
            </ul>
            <a href="#contact" className={cx('mt-8 block rounded-full py-3 text-center font-semibold', p.popular ? 'bg-white text-indigo-700 hover:bg-indigo-50' : 'bg-slate-900 text-white hover:bg-slate-800')}>
              Оставить заявку
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section id="reviews" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle eyebrow="Отзывы" title="Что говорят родители" />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {reviews.map((r) => (
            <figure key={r.name} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="flex text-amber-400">{[...Array(r.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
              <blockquote className="mt-4 leading-relaxed text-slate-700">«{r.text}»</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar name={r.name} />
                <div>
                  <div className="text-sm font-semibold">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

const FAQ = [
  ['Есть ли вступительные испытания?', 'Для 1 класса — собеседование с психологом в игровой форме. Для 2–11 классов — диагностика по математике, языкам и встреча с завучем.'],
  ['Выдаёте ли вы аттестат государственного образца?', 'Да, школа имеет государственную лицензию и аккредитацию. Выпускники получают аттестат РК.'],
  ['Можно ли перейти в середине года?', 'Да, если в классе есть место. Пробный день поможет понять, подходит ли ребёнку школа.'],
  ['Есть ли развозка?', 'Да, школьные автобусы по 6 маршрутам города. Стоимость — 35 000 ₸ в месяц.'],
  ['Как родители видят успеваемость?', 'В личном кабинете: оценки, посещаемость, расписание, домашние задания и оплаты.'],
]

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <SectionTitle eyebrow="FAQ" title="Частые вопросы" />
      <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200">
        {FAQ.map(([q, a], i) => (
          <div key={q}>
            <button className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-medium" onClick={() => setOpen(open === i ? null : i)}>
              {q}
              <ChevronDown size={18} className={cx('shrink-0 text-slate-400 transition', open === i && 'rotate-180')} />
            </button>
            {open === i && <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{a}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  const { addLead } = useStore()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ parentName: '', childName: '', phone: '', grade: '1', comment: '' })
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value })

  const submit = (e: FormEvent) => {
    e.preventDefault()
    addLead({
      parentName: form.parentName,
      childName: form.childName,
      phone: form.phone,
      grade: Number(form.grade),
      comment: form.comment,
      source: 'Сайт',
    })
    setSent(true)
  }

  const input = 'w-full rounded-xl border-0 bg-white/10 px-4 py-3 text-white placeholder:text-indigo-200 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white'
  return (
    <section id="contact" className="px-4 pb-20 sm:px-6">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-3xl bg-indigo-600 lg:grid-cols-2">
        <div className="p-8 text-white sm:p-12">
          <h2 className="text-3xl font-bold sm:text-4xl">Приходите на пробный день</h2>
          <p className="mt-4 text-indigo-100">Ребёнок проведёт день в классе, а вы познакомитесь с учителями и директором. Это бесплатно.</p>
          <div className="mt-10 space-y-4 text-indigo-100">
            <div className="flex items-center gap-3"><Phone size={18} /> +7 (727) 355-12-00</div>
            <div className="flex items-center gap-3"><Mail size={18} /> admission@horizon-school.kz</div>
            <div className="flex items-center gap-3"><MapPin size={18} /> Алматы, мкр. Горный Гигант, ул. Жамакаева, 120</div>
            <div className="flex items-center gap-3"><Clock size={18} /> Пн–Пт 08:00–19:00, Сб 10:00–14:00</div>
          </div>
        </div>
        <div className="bg-indigo-700/40 p-8 sm:p-12">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-white">
              <CheckCircle2 size={56} className="text-emerald-300" />
              <h3 className="mt-4 text-2xl font-bold">Заявка отправлена!</h3>
              <p className="mt-2 text-indigo-100">Мы перезвоним в течение рабочего дня.</p>
              <Link to="/crm/leads" className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700">
                Посмотреть заявку в CRM →
              </Link>
              <button onClick={() => { setSent(false); setForm({ parentName: '', childName: '', phone: '', grade: '1', comment: '' }) }} className="mt-3 text-sm text-indigo-200 underline">
                Отправить ещё одну
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <input required className={input} placeholder="Ваше имя" value={form.parentName} onChange={set('parentName')} />
              <input required className={input} placeholder="Имя ребёнка" value={form.childName} onChange={set('childName')} />
              <div className="grid gap-4 sm:grid-cols-2">
                <input required type="tel" className={input} placeholder="+7 (___) ___-__-__" value={form.phone} onChange={set('phone')} />
                <select className={cx(input, '[&>option]:text-slate-900')} value={form.grade} onChange={set('grade')}>
                  {Array.from({ length: 11 }, (_, i) => <option key={i} value={i + 1}>{i + 1} класс</option>)}
                </select>
              </div>
              <textarea rows={3} className={input} placeholder="Комментарий (необязательно)" value={form.comment} onChange={set('comment')} />
              <button className="w-full rounded-xl bg-white py-3.5 font-semibold text-indigo-700 hover:bg-indigo-50">Записаться</button>
              <p className="text-center text-xs text-indigo-200">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Logo light />
        <div className="text-sm">© 2026 Частная школа «{SCHOOL_NAME}». Лицензия № KZ00LAA00000000 (демо).</div>
        <Link to="/login" className="text-sm hover:text-white">Вход для сотрудников</Link>
      </div>
    </footer>
  )
}
