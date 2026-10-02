import { useEffect, useState } from 'react'
import { WorkCard } from '../components/WorkCard'
import type { Work } from '../data/mock'

const API_URL = 'http://localhost:3000/api'

export function Discover() {
  const [works, setWorks] = useState<Work[]>([])
  const [filter, setFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchWorks() {
      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(`${API_URL}/works`)

        if (!response.ok) {
          throw new Error('Unable to load student work.')
        }

        const data: Work[] = await response.json()
        setWorks(data)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Something went wrong while loading student work.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorks()
  }, [])

  const categories = [
    'All',
    ...new Set(works.map((work) => work.category)),
  ]

  const visibleWorks = works.filter(
    (work) => filter === 'All' || work.category === filter,
  )

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
        Discover
      </p>

      <h1 className="mt-2 text-5xl font-black">Student work</h1>

      <p className="mt-4 max-w-2xl text-lg text-zinc-600">
        Explore creative work from SIDA members.
      </p>

      {isLoading ? (
        <p className="my-12 text-zinc-600">Loading student work...</p>
      ) : error ? (
        <p className="my-12 text-red-600">{error}</p>
      ) : works.length === 0 ? (
        <p className="my-12 text-zinc-600">
          No approved work has been published yet. Check back soon!
        </p>
      ) : (
        <>
          <div className="my-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  filter === category
                    ? 'bg-zinc-950 text-white'
                    : 'bg-zinc-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {visibleWorks.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleWorks.map((work) => (
                <WorkCard key={work.id} work={work} />
              ))}
            </div>
          ) : (
            <p className="my-12 text-zinc-600">
              No work found in this category.
            </p>
          )}
        </>
      )}
    </section>
  )
}