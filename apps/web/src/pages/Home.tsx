import { Link } from 'react-router-dom'
import { works } from '../data/mock'
import { WorkCard } from '../components/WorkCard'

export function Home() {
  return (
    <div>
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-[1.1fr_.9fr] md:items-center">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-indigo-300">Student Independent Designers & Artists</p>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">Student talent, real creative work.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">SIDA builds a campus community for student artists and connects organizations with students looking to gain practical creative experience and strengthen their portfolios.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/commission" className="rounded-xl bg-white px-5 py-3 font-bold text-zinc-950">Request a Commission</Link>
              <Link to="/members" className="rounded-xl border border-zinc-700 px-5 py-3 font-bold">Meet the Artists</Link>
            </div>
          </div>
          <div className="aspect-video rounded-2xl border border-zinc-700 bg-zinc-900 p-3 shadow-2xl">
            <div className="flex h-full items-center justify-center rounded-xl bg-zinc-800 text-zinc-500">Member reel / featured work video</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            ['For Clients', 'Submit creative requests and connect with student artists for real projects.'],
            ['For Members', 'Build experience, meet other creatives, and publish approved portfolio work.'],
            ['For Campus', 'Create a shared network for departments, organizations, and student talent.'],
          ].map(([title, text]) => <div key={title} className="rounded-2xl border border-zinc-200 bg-white p-7"><h2 className="text-2xl font-black">{title}</h2><p className="mt-3 leading-7 text-zinc-600">{text}</p></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Featured</p><h2 className="mt-1 text-3xl font-black">Recent work</h2></div><Link to="/discover" className="font-semibold hover:underline">View all work →</Link></div>
        <div className="grid gap-6 md:grid-cols-3">{works.filter(w => w.status === 'approved').map(w => <WorkCard key={w.id} work={w} />)}</div>
      </section>
    </div>
  )
}
