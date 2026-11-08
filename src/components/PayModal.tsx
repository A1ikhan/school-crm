import { useState } from 'react'
import type { Payment } from '../data/types'
import { money, periodLabel } from '../lib'
import { Button, Field, Modal } from './ui'

export function PayModal({ payment, onClose, onPay }: { payment: Payment | null; onClose: () => void; onPay: (m: Payment['method']) => void }) {
  const [method, setMethod] = useState<NonNullable<Payment['method']>>('Kaspi')
  return (
    <Modal open={!!payment} onClose={onClose} title="Принять оплату">
      {payment && (
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">{periodLabel(payment.period)}</div>
            <div className="text-2xl font-bold">{money(payment.amount)}</div>
          </div>
          <Field label="Способ оплаты">
            <div className="grid grid-cols-2 gap-2">
              {(['Kaspi', 'Карта', 'Перевод', 'Наличные'] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMethod(m)} className={`rounded-lg px-3 py-2 text-sm ring-1 ${method === m ? 'bg-indigo-50 font-medium text-indigo-700 ring-indigo-400' : 'ring-slate-200'}`}>{m}</button>
              ))}
            </div>
          </Field>
          <Button className="w-full" onClick={() => onPay(method)}>Подтвердить оплату</Button>
        </div>
      )}
    </Modal>
  )
}
