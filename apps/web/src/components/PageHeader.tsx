export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-widest text-indigo-600">{eyebrow}</p>}
      <h1 className="text-4xl font-black tracking-tight md:text-6xl">{title}</h1>
      {description && <p className="mt-4 text-lg leading-8 text-zinc-600">{description}</p>}
    </div>
  )
}
