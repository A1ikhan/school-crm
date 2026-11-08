import { Navigate, Route, Routes } from 'react-router-dom'
import Landing from './landing/Landing'
import CrmLayout from './crm/CrmLayout'
import Dashboard from './crm/pages/Dashboard'
import Leads from './crm/pages/Leads'
import Students from './crm/pages/Students'
import StudentDetail from './crm/pages/StudentDetail'
import Teachers from './crm/pages/Teachers'
import Classes from './crm/pages/Classes'
import Schedule from './crm/pages/Schedule'
import Payments from './crm/pages/Payments'
import Login from './crm/Login'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/crm" element={<CrmLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentDetail />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="classes" element={<Classes />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="payments" element={<Payments />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
