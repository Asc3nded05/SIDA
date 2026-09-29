import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Work } from '../data/mock'
import { WorkCard } from '../components/WorkCard'

type Member = {
  id: string
  name: string
  title: string | null
  bio: string | null
  disciplines: string[]
  profileImage: string | null
  role: 'MEMBER' | 'LEADERSHIP'
}

export function MemberProfile() {
  const { memberId } = useParams()

  const [member, setMember] = useState<Member | null>(null)
  const [portfolio, setPortfolio] = useState<Work[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [portfolioError, setPortfolioError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchMember() {
      if (!memberId) {
        setNotFound(true)
        setIsLoading(false)
        setIsPortfolioLoading(false)
        return
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/members/${encodeURIComponent(memberId)}`,
          { signal: controller.signal },
        )

        if (response.status === 404) {
          setNotFound(true)
          return
        }

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data: Member = await response.json()
        setMember(data)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return

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

    async function fetchPortfolio() {
      if (!memberId) return

      try {
        const response = await fetch(
          `http://localhost:3000/api/members/${encodeURIComponent(memberId)}/works`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data: Work[] = await response.json()
        setPortfolio(data)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return

        setPortfolioError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setIsPortfolioLoading(false)
        }
      }
    }

    fetchMember()
    fetchPortfolio()

    return () => controller.abort()
  }, [memberId])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-zinc-500">
        Loading member...
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20">
        <p>Member not found.</p>
        <Link to="/members" className="mt-4 inline-block text-sm font-semibold">
          ← All members
        </Link>
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20">
        <p className="font-bold text-red-700">Unable to load member</p>
        <p className="mt-2 text-sm text-zinc-600">
          {error || 'An unexpected error occurred.'}
        </p>
        <Link to="/members" className="mt-4 inline-block text-sm font-semibold">
          ← All members
        </Link>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <Link to="/members" className="text-sm font-semibold">
        ← All members
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-[280px_1fr]">
        <img
          src={
            member.profileImage ||
            'https://placehold.co/500x500?text=SIDA+Member'
          }
          alt={member.name}
          className="aspect-square w-full rounded-2xl object-cover"
        />

        <div>
          <p className="font-bold uppercase tracking-widest text-indigo-600">
            {member.title || member.role}
          </p>

          <h1 className="mt-2 text-5xl font-black">{member.name}</h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {member.disciplines.map((discipline) => (
              <span
                key={discipline}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm"
              >
                {discipline}
              </span>
            ))}
          </div>

          {member.bio && (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              {member.bio}
            </p>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-3xl font-black">Portfolio</h2>

        {isPortfolioLoading && (
          <p className="text-zinc-500">Loading portfolio...</p>
        )}

        {portfolioError && (
          <p className="text-red-700">
            Unable to load portfolio: {portfolioError}
          </p>
        )}

        {!isPortfolioLoading && !portfolioError && portfolio.length === 0 && (
          <p className="text-zinc-500">
            This member has not published any work yet.
          </p>
        )}

        {!isPortfolioLoading && !portfolioError && portfolio.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}