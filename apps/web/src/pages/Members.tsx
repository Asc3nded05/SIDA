import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'

type Member = {
  id: string
  name: string
  title: string | null
  bio: string | null
  disciplines: string[]
  profileImage: string | null
  role: 'MEMBER' | 'LEADERSHIP'
}

export function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchMembers() {
      try {
        const response = await fetch('http://localhost:3000/api/members', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data: Member[] = await response.json()
        setMembers(data)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }

        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    fetchMembers()

    return () => controller.abort()
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <PageHeader
        eyebrow="The community"
        title="Meet the artists"
        description="Browse SIDA members by discipline and explore their individual portfolios."
      />

      {isLoading && (
        <p className="py-12 text-center text-zinc-500">
          Loading members...
        </p>
      )}

      {error && (
        <div className="my-8 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <h2 className="font-bold">Unable to load members</h2>
          <p className="mt-1 text-sm">{error}</p>
          <p className="mt-2 text-sm">
            Make sure the SIDA API is running at localhost:3000.
          </p>
        </div>
      )}

      {!isLoading && !error && members.length === 0 && (
        <p className="py-12 text-center text-zinc-500">
          No members have been added yet.
        </p>
      )}

      {!isLoading && !error && members.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <Link
              key={member.id}
              to={`/members/${member.id}`}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            >
              <img
                src={
                  member.profileImage ||
                  'https://placehold.co/500x500?text=SIDA+Member'
                }
                alt={member.name}
                className="aspect-square w-full object-cover"
              />

              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  {member.title || member.role}
                </p>

                <h2 className="mt-1 text-2xl font-black group-hover:underline">
                  {member.name}
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {member.disciplines.map((discipline) => (
                    <span
                      key={discipline}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium"
                    >
                      {discipline}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}