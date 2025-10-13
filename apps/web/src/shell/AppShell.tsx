import { Outlet, Link, NavLink } from 'react-router-dom'
import { Pill, Store, BarChart2 } from 'lucide-react'

export function AppShell() {
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Pill className="text-brand" /> Camepharm
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink to="/" className={({isActive}) => isActive ? 'text-brand' : 'hover:text-brand'}>Find Medicines</NavLink>
            <NavLink to="/pharmacy/onboarding" className={({isActive}) => isActive ? 'text-brand' : 'hover:text-brand'}>Pharmacy Portal</NavLink>
            <NavLink to="/admin" className={({isActive}) => isActive ? 'text-brand' : 'hover:text-brand'}>Analytics</NavLink>
          </nav>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Camepharm</span>
          <div className="flex items-center gap-4">
            <a href="https://example.com" target="_blank" rel="noreferrer" className="hover:text-brand flex items-center gap-1"><Store size={16}/> Partner with us</a>
            <a href="https://example.com" target="_blank" rel="noreferrer" className="hover:text-brand flex items-center gap-1"><BarChart2 size={16}/> Data Access</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
