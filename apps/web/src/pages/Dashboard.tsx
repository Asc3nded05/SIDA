import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const API_URL = 'http://localhost:3000/api'

type WorkStatus = 'PENDING' | 'APPROVED' | 'DENIED'

type MemberWork = {
  id: string
  title: string
  description: string | null
  category: string
  mediaUrl: string
  thumbnailUrl: string | null
  status: WorkStatus
  reviewedAt: string | null
  createdAt: string
}

type WorkForm = {
  title: string
  description: string
  category: string
  mediaUrl: string
  thumbnailUrl: string
}

const emptyForm: WorkForm = {
  title: '',
  description: '',
  category: '',
  mediaUrl: '',
  thumbnailUrl: '',
}

export function Dashboard() {
  const { member, accessToken, logout } = useAuth()
  const navigate = useNavigate()

  const [works, setWorks] = useState<MemberWork[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<WorkForm>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    async function loadWorks() {
      if (!accessToken) {
        setIsLoading(false)
        setError('You must be logged in to view your work.')
        return
      }

      try {
        const response = await fetch(`${API_URL}/works/mine`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Unable to load your work (${response.status}).`)
        }

        const data: MemberWork[] = await response.json()
        setWorks(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred while loading your work.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadWorks()
  }, [accessToken])

  function handleLogout() {
    logout()
    navigate('/')
  }

  function updateForm(field: keyof WorkForm, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!accessToken) {
      setError('You must be logged in to submit work.')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`${API_URL}/works`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          category: form.category,
          mediaUrl: form.mediaUrl,
          thumbnailUrl: form.thumbnailUrl || undefined,
        }),
      })

      if (!response.ok) {
        const responseBody = await response.json().catch(() => null)
        const message = Array.isArray(responseBody?.message)
          ? responseBody.message.join(' ')
          : responseBody?.message

        throw new Error(
          message || `Unable to submit your work (${response.status}).`,
        )
      }

      const newWork: MemberWork = await response.json()

      setWorks((current) => [newWork, ...current])
      setForm(emptyForm)
      setShowForm(false)
      setSuccess('Your work has been submitted for leadership review.')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while submitting your work.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!member) {
    return null
  }

  const firstName = member.name.split(' ')[0]

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            Member portal
          </p>
          <h1 className="mt-2 text-5xl font-black">
            Welcome, {firstName}
          </h1>
          <p className="mt-2 text-zinc-600">
            Manage your profile and portfolio submissions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold"
        >
          Log out
        </button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Card
          title="Profile"
          text="Edit your public bio, contact details, disciplines, and profile image."
        />
        <Card
          title="Portfolio"
          text="Submit new work for leadership review before it becomes public."
        />
        <Card
          title="Status"
          text={`${works.length} portfolio ${
            works.length === 1 ? 'piece' : 'pieces'
          } associated with your account.`}
        />
      </div>

      <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black">Your work</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Submissions are reviewed before appearing publicly.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm((current) => !current)
              setError(null)
              setSuccess(null)
            }}
            className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-bold text-white"
          >
            {showForm ? 'Cancel' : '+ New Work'}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            {success}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5 rounded-xl border border-zinc-200 bg-zinc-50 p-5"
          >
            <h3 className="text-xl font-bold">Submit new work</h3>

            <div>
              <label
                htmlFor="work-title"
                className="mb-1 block text-sm font-semibold"
              >
                Title
              </label>
              <input
                id="work-title"
                required
                maxLength={120}
                value={form.title}
                onChange={(event) => updateForm('title', event.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="work-category"
                className="mb-1 block text-sm font-semibold"
              >
                Category
              </label>
              <input
                id="work-category"
                required
                maxLength={80}
                placeholder="e.g. Graphic Design, Motion Design, Web Design"
                value={form.category}
                onChange={(event) => updateForm('category', event.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="work-description"
                className="mb-1 block text-sm font-semibold"
              >
                Description <span className="font-normal text-zinc-500">(optional)</span>
              </label>
              <textarea
                id="work-description"
                rows={4}
                maxLength={2000}
                value={form.description}
                onChange={(event) =>
                  updateForm('description', event.target.value)
                }
                className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="work-media-url"
                className="mb-1 block text-sm font-semibold"
              >
                Media URL
              </label>
              <input
                id="work-media-url"
                type="url"
                required
                placeholder="https://..."
                value={form.mediaUrl}
                onChange={(event) => updateForm('mediaUrl', event.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Link to the image or video you want to submit.
              </p>
            </div>

            <div>
              <label
                htmlFor="work-thumbnail-url"
                className="mb-1 block text-sm font-semibold"
              >
                Thumbnail URL <span className="font-normal text-zinc-500">(optional)</span>
              </label>
              <input
                id="work-thumbnail-url"
                type="url"
                placeholder="https://..."
                value={form.thumbnailUrl}
                onChange={(event) =>
                  updateForm('thumbnailUrl', event.target.value)
                }
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2"
              />
              <p className="mt-1 text-xs text-zinc-500">
                A preview image for the submission. Video submissions can use a separate thumbnail.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for review'}
            </button>
          </form>
        )}

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <p className="text-sm text-zinc-500">Loading your work...</p>
          ) : works.length === 0 ? (
            <p className="rounded-xl bg-zinc-50 p-5 text-sm text-zinc-500">
              You haven’t submitted any work yet.
            </p>
          ) : (
            works.map((work) => (
              <div
                key={work.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-zinc-50 p-4"
              >
                <div>
                  <p className="font-bold">{work.title}</p>
                  <p className="text-sm text-zinc-500">{work.category}</p>
                </div>

                <StatusBadge status={work.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: WorkStatus }) {
  const styles: Record<WorkStatus, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    APPROVED: 'bg-green-100 text-green-800',
    DENIED: 'bg-red-100 text-red-800',
  }

  const labels: Record<WorkStatus, string> = {
    PENDING: 'Pending review',
    APPROVED: 'Approved',
    DENIED: 'Denied',
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}