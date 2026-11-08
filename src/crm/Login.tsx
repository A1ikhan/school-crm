import { GraduationCap } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Field, Input } from '../components/ui'
import { SCHOOL_NAME } from '../data/constants'

export default function Login() {
  const nav = useNavigate()
  const [email, setEmail] = useState('admin@horizon-school.kz')
  const [password, setPassword] = useState('demo1234')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    nav('/crm')
  }
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-50 via-white to-amber-50 px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white"><GraduationCap size={22} /></div>
          <span className="text-xl font-bold">{SCHOOL_NAME} CRM</span>
        </Link>
        <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
          <h1 className="text-lg font-semibold">Вход для сотрудников</h1>
          <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Пароль"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
          <Button className="w-full">Войти</Button>
          <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Демо-режим: данные для входа уже заполнены, проверки нет.</p>
        </form>
        <Link to="/" className="mt-6 block text-center text-sm text-slate-500 hover:text-indigo-600">← На сайт школы</Link>
      </div>
    </div>
  )
}
