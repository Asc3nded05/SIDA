import { NavLink, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { CommissionRequest } from './pages/CommissionRequest'
import { Members } from './pages/Members'
import { MemberProfile } from './pages/MemberProfile'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Moderation } from './pages/Moderation'
import { CreateMember } from './pages/CreateMember'
import { Discover } from './pages/Discover'

const nav = [
  ['/', 'Home'],
  ['/members', 'Members'],
  ['/discover', 'Work'],
  ['/commission', 'Request a Commission'],
]

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4">
          <NavLink to="/" className="font-black tracking-tight text-xl">SIDA</NavLink>
          <nav className="hidden gap-5 text-sm font-medium md:flex">
            {nav.map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'text-indigo-600' : 'text-zinc-600 hover:text-zinc-950'}>{label}</NavLink>
            ))}
          </nav>
          <NavLink to="/login" className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800">Member Login</NavLink>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/commission" element={<CommissionRequest />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:memberId" element={<MemberProfile />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leadership/moderation" element={<Moderation />} />
          <Route path="/leadership/members/new" element={<CreateMember />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="mt-20 border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 text-sm text-zinc-500">
          Student Independent Designers and Artists · Built and maintained by SIDA students
        </div>
      </footer>
    </div>
  )
}

function NotFound() {
  return <div className="mx-auto max-w-4xl px-5 py-24"><h1 className="text-4xl font-black">Page not found</h1></div>
}
