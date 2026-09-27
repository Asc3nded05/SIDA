import { Link } from 'react-router-dom'
import type { Work } from '../data/mock'

export function WorkCard({ work }: { work: Work }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <img src={work.image} alt="" className="aspect-[3/2] w-full object-cover" />
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">{work.category}</p>
        <h3 className="mt-2 text-xl font-bold">{work.title}</h3>
        <p className="mt-2 text-sm text-zinc-600">{work.description}</p>
        <Link className="mt-4 inline-block text-sm font-semibold hover:underline" to={`/members/${work.memberId}`}>{work.memberName}</Link>
      </div>
    </article>
  )
}
