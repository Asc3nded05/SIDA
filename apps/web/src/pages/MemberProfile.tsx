import { Link, useParams } from 'react-router-dom'
import { members, works } from '../data/mock'
import { WorkCard } from '../components/WorkCard'

export function MemberProfile() {
  const { memberId } = useParams()
  const member = members.find(m => m.id === memberId)
  if (!member) return <div className="mx-auto max-w-4xl px-5 py-20">Member not found.</div>
  const portfolio = works.filter(w => w.memberId === member.id && w.status === 'approved')
  return <section className="mx-auto max-w-7xl px-5 py-16"><Link to="/members" className="text-sm font-semibold">← All members</Link><div className="mt-8 grid gap-10 md:grid-cols-[280px_1fr]"><img src={member.image} alt={member.name} className="aspect-square w-full rounded-2xl object-cover" /><div><p className="font-bold uppercase tracking-widest text-indigo-600">{member.role}</p><h1 className="mt-2 text-5xl font-black">{member.name}</h1><div className="mt-5 flex flex-wrap gap-2">{member.disciplines.map(d => <span key={d} className="rounded-full bg-zinc-100 px-3 py-1 text-sm">{d}</span>)}</div><p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">{member.bio}</p><p className="mt-4 text-sm text-zinc-500">{member.email}</p></div></div><div className="mt-16"><h2 className="mb-6 text-3xl font-black">Portfolio</h2><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{portfolio.map(w => <WorkCard key={w.id} work={w} />)}</div></div></section>
}
