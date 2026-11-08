import { LEAD_SOURCES, MANAGERS, feeForGrade } from './constants'
import type { Lead, LeadStatus, Lesson, Payment, PaymentStatus, Review, SchoolClass, Student, Teacher } from './types'

// Детерминированный генератор случайных чисел — мокап-данные одинаковые при каждом запуске.
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(20260901)
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]
const between = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1))
const pad = (n: number) => String(n).padStart(2, '0')

const MALE_NAMES = ['Алихан', 'Арсен', 'Тимур', 'Даниял', 'Максим', 'Артём', 'Нурсултан', 'Ерасыл', 'Иван', 'Марк', 'Санжар', 'Айдар', 'Лев', 'Егор', 'Әли', 'Мирас', 'Адиль', 'Кирилл', 'Рамазан', 'Дамир']
const FEMALE_NAMES = ['Амина', 'София', 'Айлин', 'Алия', 'Мария', 'Дария', 'Томирис', 'Ева', 'Аружан', 'Анна', 'Камила', 'Зере', 'Полина', 'Медина', 'Алиса', 'Асель', 'Виктория', 'Инкар', 'Сабина', 'Милана']
const SURNAMES = ['Ахметов', 'Иванов', 'Сериков', 'Жумабеков', 'Ким', 'Нурланов', 'Смирнов', 'Касымов', 'Петров', 'Абдрахманов', 'Есенов', 'Морозов', 'Бекмуратов', 'Оспанов', 'Волков', 'Тулегенов', 'Калиев', 'Соколов', 'Байжанов', 'Мухамедов', 'Лебедев', 'Сатпаев', 'Козлов', 'Утепов']
const PARENT_MALE = ['Ерлан', 'Алексей', 'Бауыржан', 'Дмитрий', 'Асхат', 'Сергей', 'Нурлан', 'Андрей', 'Канат', 'Руслан']
const PARENT_FEMALE = ['Айгуль', 'Елена', 'Динара', 'Ольга', 'Жанар', 'Наталья', 'Гульнара', 'Светлана', 'Сауле', 'Татьяна']

function surname(base: string, gender: 'm' | 'f') {
  if (gender === 'f' && /(ов|ев|ин)$/.test(base)) return base + 'а'
  return base
}
function phone() {
  return `+7 (7${between(0, 7)}${between(0, 9)}) ${between(100, 999)}-${pad(between(0, 99))}-${pad(between(0, 99))}`
}
const translit: Record<string, string> = { а: 'a', ә: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ұ: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sh', ы: 'y', э: 'e', ю: 'yu', я: 'ya', ь: '', ъ: '' }
const latin = (s: string) => s.toLowerCase().split('').map((c) => translit[c] ?? c).join('')

// ---------- Учителя ----------
export const teachers: Teacher[] = [
  { id: 't1', name: 'Гульмира Аскаровна Байжанова', subjects: ['Математика'], experience: 22, rating: 4.9, education: 'КазНУ им. аль-Фараби, мехмат', bio: 'Подготовила 14 призёров республиканских олимпиад.', color: 'bg-indigo-500' },
  { id: 't2', name: 'Игорь Валерьевич Смирнов', subjects: ['Физика', 'Астрономия'], experience: 15, rating: 4.8, education: 'НГУ, физический факультет', bio: 'Ведёт инженерный клуб и кружок робототехники.', color: 'bg-sky-500' },
  { id: 't3', name: 'Анна Сергеевна Ким', subjects: ['Английский язык'], experience: 11, rating: 4.9, education: 'КазУМОиМЯ, CELTA', bio: 'Готовит к IELTS и Cambridge English.', color: 'bg-rose-500' },
  { id: 't4', name: 'Жанна Ерболовна Оспанова', subjects: ['Казахский язык', 'Литература'], experience: 18, rating: 4.7, education: 'ЕНУ им. Гумилёва', bio: 'Автор методики «Тіл — ойын арқылы».', color: 'bg-amber-500' },
  { id: 't5', name: 'Елена Викторовна Морозова', subjects: ['Русский язык', 'Литература'], experience: 25, rating: 4.8, education: 'МПГУ', bio: 'Руководит школьным театром и литературной студией.', color: 'bg-fuchsia-500' },
  { id: 't6', name: 'Арман Нурланович Сериков', subjects: ['Информатика'], experience: 8, rating: 4.9, education: 'КБТУ, Computer Science', bio: 'Бывший backend-разработчик, учит Python и алгоритмам.', color: 'bg-emerald-500' },
  { id: 't7', name: 'Ольга Петровна Лебедева', subjects: ['Химия', 'Биология'], experience: 19, rating: 4.6, education: 'КазНМУ', bio: 'Проводит лабораторные практикумы для 7–11 классов.', color: 'bg-teal-500' },
  { id: 't8', name: 'Бауыржан Канатович Есенов', subjects: ['История', 'Обществознание'], experience: 13, rating: 4.7, education: 'КазНПУ им. Абая', bio: 'Организует исторические экспедиции по Казахстану.', color: 'bg-orange-500' },
  { id: 't9', name: 'Сауле Мухтаровна Калиева', subjects: ['Начальные классы'], experience: 20, rating: 5.0, education: 'КазНПУ им. Абая', bio: 'Классный руководитель, специалист по адаптации первоклассников.', color: 'bg-pink-500' },
  { id: 't10', name: 'Мария Андреевна Волкова', subjects: ['Начальные классы'], experience: 9, rating: 4.8, education: 'ПГУ им. Торайгырова', bio: 'Внедряет проектное обучение в начальной школе.', color: 'bg-violet-500' },
  { id: 't11', name: 'Дамир Ерланович Тулегенов', subjects: ['Физкультура'], experience: 7, rating: 4.6, education: 'КазАСТ', bio: 'КМС по плаванию, тренер школьной сборной.', color: 'bg-lime-600' },
  { id: 't12', name: 'Светлана Игоревна Козлова', subjects: ['География', 'Искусство'], experience: 14, rating: 4.7, education: 'КарГУ', bio: 'Ведёт курс «Дизайн и визуальное мышление».', color: 'bg-cyan-600' },
].map((t) => ({
  ...t,
  phone: phone(),
  email: `${latin(t.name.split(' ')[0])}.${latin(t.name.split(' ')[2])}@horizon-school.kz`,
}))

// ---------- Классы ----------
const classDefs: [number, string, string, string][] = [
  [1, 'А', 't9', '101'], [1, 'Б', 't10', '102'], [2, 'А', 't9', '103'], [3, 'А', 't10', '104'], [4, 'А', 't9', '105'],
  [5, 'А', 't5', '201'], [6, 'А', 't4', '202'], [7, 'А', 't1', '203'], [8, 'А', 't3', '204'], [9, 'А', 't8', '205'],
  [10, 'А', 't2', '301'], [11, 'А', 't6', '302'],
]
export const classes: SchoolClass[] = classDefs.map(([grade, letter, curatorId, room]) => ({
  id: `${grade}${letter}`, grade, letter, curatorId, room,
}))

// ---------- Ученики ----------
export const students: Student[] = []
let sid = 1
for (const cls of classes) {
  const size = between(9, 14)
  for (let i = 0; i < size; i++) {
    const gender: 'm' | 'f' = rand() < 0.5 ? 'm' : 'f'
    const base = pick(SURNAMES)
    const birthYear = 2026 - cls.grade - 6 - (rand() < 0.3 ? 1 : 0)
    const parentGender: 'm' | 'f' = rand() < 0.65 ? 'f' : 'm'
    const parentFirst = parentGender === 'f' ? pick(PARENT_FEMALE) : pick(PARENT_MALE)
    const lastName = surname(base, gender)
    const enrollYear = between(Math.max(2026 - cls.grade + 1, 2019), 2026)
    const statusRoll = rand()
    students.push({
      id: `s${sid++}`,
      firstName: gender === 'm' ? pick(MALE_NAMES) : pick(FEMALE_NAMES),
      lastName,
      gender,
      classId: cls.id,
      birthDate: `${birthYear}-${pad(between(1, 12))}-${pad(between(1, 28))}`,
      parentName: `${parentFirst} ${surname(base, parentGender)}`,
      parentPhone: phone(),
      parentEmail: `${latin(parentFirst)}.${latin(base)}${between(1, 99)}@mail.kz`,
      enrolledAt: `${enrollYear}-${enrollYear === 2026 ? '09' : pad(between(8, 9))}-${pad(between(1, 15))}`,
      status: statusRoll < 0.93 ? 'active' : statusRoll < 0.98 ? 'paused' : 'left',
      avgScore: Math.round((3.4 + rand() * 1.6) * 10) / 10,
      attendance: between(82, 100),
      monthlyFee: feeForGrade(cls.grade),
      discount: rand() < 0.15 ? pick([10, 15, 20]) : 0,
    })
  }
}

// ---------- Платежи ----------
// Учебный год: сентябрь–май. Генерируем с января 2026 по ноябрь 2026, без лета.
const PERIODS = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-09', '2026-10', '2026-11']
export const payments: Payment[] = []
let pid = 1
for (const s of students) {
  for (const period of PERIODS) {
    if (period >= '2026-09' && s.enrolledAt > `${period}-31`) continue
    if (period < '2026-09' && s.enrolledAt >= '2026-08') continue
    if (s.status === 'left' && period >= '2026-10') continue
    const amount = Math.round((s.monthlyFee * (100 - s.discount)) / 100)
    let status: PaymentStatus = 'paid'
    if (period === '2026-11') status = rand() < 0.62 ? 'paid' : rand() < 0.8 ? 'pending' : 'overdue'
    else if (period === '2026-10') status = rand() < 0.94 ? 'paid' : 'overdue'
    const [y, m] = period.split('-')
    payments.push({
      id: `p${pid++}`,
      studentId: s.id,
      period,
      amount,
      status,
      paidAt: status === 'paid' ? `${y}-${m}-${pad(between(1, period === '2026-11' ? 7 : 10))}` : undefined,
      method: status === 'paid' ? pick(['Kaspi', 'Kaspi', 'Карта', 'Перевод', 'Наличные'] as const) : undefined,
    })
  }
}

// ---------- Заявки (воронка) ----------
const LEAD_COMMENTS = [
  'Переезжают из Астаны, интересует 2-я смена продлёнки',
  'Хотят усиленный английский',
  'Ребёнок сейчас на семейном обучении',
  'Спрашивали про скидку для второго ребёнка',
  'Интересует подготовка к НИШ / IELTS',
  'Пришли по рекомендации семьи Ахметовых',
  'Важно наличие бассейна и секций',
  'Перезвонить после 18:00',
  'Хотят посмотреть школу в субботу',
  'Сравнивают с двумя другими школами',
  '',
]
const leadStatusWeights: LeadStatus[] = ['new', 'new', 'new', 'contacted', 'contacted', 'contacted', 'trial', 'trial', 'contract', 'contract', 'lost']
export const leads: Lead[] = Array.from({ length: 34 }, (_, i) => {
  const gender: 'm' | 'f' = rand() < 0.5 ? 'm' : 'f'
  const base = pick(SURNAMES)
  const parentGender: 'm' | 'f' = rand() < 0.7 ? 'f' : 'm'
  const daysAgo = between(0, 45)
  const created = new Date('2026-11-08T12:00:00')
  created.setDate(created.getDate() - daysAgo)
  created.setHours(between(9, 20), between(0, 59))
  const status: LeadStatus = daysAgo < 3 ? 'new' : pick(leadStatusWeights)
  return {
    id: `l${i + 1}`,
    parentName: `${parentGender === 'f' ? pick(PARENT_FEMALE) : pick(PARENT_MALE)} ${surname(base, parentGender)}`,
    childName: `${gender === 'm' ? pick(MALE_NAMES) : pick(FEMALE_NAMES)} ${surname(base, gender)}`,
    phone: phone(),
    grade: between(1, 10),
    source: pick(LEAD_SOURCES),
    status,
    createdAt: created.toISOString(),
    manager: pick(MANAGERS),
    comment: pick(LEAD_COMMENTS),
  }
}).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

// ---------- Расписание ----------
const PRIMARY = ['Математика', 'Русский язык', 'Казахский язык', 'Литературное чтение', 'Английский язык', 'Познание мира', 'Физкультура', 'Искусство']
const MIDDLE = ['Математика', 'Русский язык', 'Казахский язык', 'Литература', 'Английский язык', 'История', 'География', 'Биология', 'Физкультура', 'Информатика']
const SENIOR = ['Алгебра', 'Геометрия', 'Физика', 'Химия', 'Биология', 'Английский язык', 'Казахский язык', 'Русский язык', 'История', 'Информатика', 'Обществознание', 'Физкультура']

function teacherFor(subject: string, cls: SchoolClass): string {
  if (cls.grade <= 4 && !['Английский язык', 'Физкультура', 'Казахский язык'].includes(subject)) return cls.curatorId
  const map: Record<string, string> = {
    'Математика': 't1', 'Алгебра': 't1', 'Геометрия': 't1', 'Физика': 't2', 'Английский язык': 't3', 'Казахский язык': 't4',
    'Русский язык': 't5', 'Литература': 't5', 'Информатика': 't6', 'Химия': 't7', 'Биология': 't7', 'История': 't8',
    'Обществознание': 't8', 'Физкультура': 't11', 'География': 't12', 'Искусство': 't12',
  }
  return map[subject] ?? cls.curatorId
}

export const lessons: Lesson[] = []
for (const cls of classes) {
  const pool = cls.grade <= 4 ? PRIMARY : cls.grade <= 9 ? MIDDLE : SENIOR
  const perDay = cls.grade <= 4 ? 4 : cls.grade <= 9 ? 6 : 7
  for (let day = 0; day < 5; day++) {
    const used = new Set<string>()
    for (let slot = 0; slot < perDay; slot++) {
      let subject = pick(pool)
      if (slot === 0 && pool.includes('Математика')) subject = day % 2 === 0 ? 'Математика' : subject
      let guard = 0
      while (used.has(subject) && guard++ < 10) subject = pick(pool)
      used.add(subject)
      const teacherId = teacherFor(subject, cls)
      lessons.push({
        classId: cls.id, day, slot, subject, teacherId,
        room: subject === 'Физкультура' ? 'Спортзал' : subject === 'Информатика' ? 'IT-лаб' : cls.room,
      })
    }
  }
}

// ---------- Отзывы для лендинга ----------
export const reviews: Review[] = [
  { name: 'Динара Касымова', role: 'мама Амины, 3А', rating: 5, text: 'За год дочь полюбила учиться. В классе 12 детей, учитель знает каждого. Отдельное спасибо за продлёнку с кружками — домой приходит с выполненными уроками.' },
  { name: 'Алексей Петров', role: 'папа Марка, 8А', rating: 5, text: 'Перевели сына из обычной школы, где он терялся. Здесь с ним занимаются по индивидуальному плану по математике, он уже ездит на городские олимпиады.' },
  { name: 'Жанар Нурланова', role: 'мама Ерасыла, 11А', rating: 5, text: 'Сильная подготовка к ЕНТ и IELTS: у сына 7.5 в 10 классе. Удобно, что всё — оценки, оплаты, расписание — видно в личном кабинете.' },
  { name: 'Ольга Смирнова', role: 'мама Евы, 1Б', rating: 5, text: 'Боялись адаптации, но первые недели прошли мягко. Психолог школы был на связи, а учитель присылала фото с уроков.' },
]
