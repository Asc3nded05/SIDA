import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

const API_URL = 'http://localhost:3000/api'

type PendingWork = {
  id: string
  title: string
  description: string | null
  category: string
  mediaUrl: string
  thumbnailUrl: string | null
  createdAt: string
  member: {
    id: string
    name: string
    email: string
  }
}

export function Moderation() {
  const { accessToken } = useAuth()

  const [pending, setPending] = useState<PendingWork[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  async function loadQueue() {
    if (!accessToken) {
      setError('You must be logged in to view the moderation queue.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/moderation/queue`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Unable to load the queue (${response.status}).`)
      }

      const data: PendingWork[] = await response.json()
      setPending(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while loading the queue.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadQueue()
  }, [accessToken])

  async function reviewWork(
    workId: string,
    decision: 'approve' | 'deny',
  ) {
    if (!accessToken) {
      setError('You must be logged in to review submissions.')
      return
    }

    setProcessingId(workId)
    setError(null)

    try {
      const response = await fetch(
        `${API_URL}/moderation/${workId}/${decision}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(
          `Unable to ${decision} this submission (${response.status}).`,
        )
      }

      // Remove the reviewed submission from the pending queue.
      setPending((current) => current.filter((work) => work.id !== workId))
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while reviewing this submission.',
      )
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
        Leadership only
      </p>

      <h1 className="mt-2 text-5xl font-black">Moderation queue</h1>

      <p className="mt-4 max-w-2xl text-zinc-600">
        Review member submissions before they are published publicly.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="mt-10 text-zinc-500">Loading moderation queue...</p>
      ) : pending.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-8 text-center">
          <h2 className="text-xl font-bold">Queue is clear</h2>
          <p className="mt-2 text-sm text-zinc-500">
            There are currently no pending submissions to review.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {pending.map((work) => (
            <div
              key={work.id}
              className="grid gap-5 rounded-2xl border border-zinc-200 bg-white p-5 md:grid-cols-[220px_1fr_auto] md:items-center"
            >
              <img
                src={work.thumbnailUrl || work.mediaUrl}
                alt={work.title}
                className="aspect-[3/2] w-full rounded-lg object-cover"
              />

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  {work.category}
                </p>

                <h2 className="mt-1 text-2xl font-black">{work.title}</h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Submitted by {work.member.name}
                </p>

                <p className="mt-3 text-sm text-zinc-600">
                  {work.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex gap-2 md:flex-col">
                <button
                  type="button"
                  disabled={processingId !== null}
                  onClick={() => reviewWork(work.id, 'approve')}
                  className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingId === work.id ? 'Processing...' : 'Approve'}
                </button>

                <button
                  type="button"
                  disabled={processingId !== null}
                  onClick={() => reviewWork(work.id, 'deny')}
                  className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processingId === work.id ? 'Processing...' : 'Deny'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}