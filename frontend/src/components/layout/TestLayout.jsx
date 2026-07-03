import { Outlet } from 'react-router-dom'

export default function TestLayout() {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <Outlet />
    </div>
  )
}
