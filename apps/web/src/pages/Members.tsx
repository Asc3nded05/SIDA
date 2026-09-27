import { Link } from 'react-router-dom'
import { members } from '../data/mock'
import { PageHeader } from '../components/PageHeader'

export function Members() {
  return <section className="mx-auto max-w-7xl px-5 py-16"><PageHeader eyebrow="The community" title="Meet the artists" description="Browse SIDA members by discipline and explore their individual portfolios." /><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{members.map(member => <Link key={member.id} to={`/members/${member.id}`} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white"><img src={member.image} alt={member.name} className="aspect-square w-full object-cover" /><div className="p-5"><p className="text-xs font-bold uppercase tracking-widest text-indigo-600">{member.role}</p><h2 className="mt-1 text-2xl font-black group-hover:underline">{member.name}</h2><div className="mt-3 flex flex-wrap gap-2">{member.disciplines.map(d => <span key={d} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium">{d}</span>)}</div></div></Link>)}</div></section>
}
