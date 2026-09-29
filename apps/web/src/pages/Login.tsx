import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { PageHeader } from '../components/PageHeader'

type LoginLocationState = {
  from?: {
    pathname?: string
  }
}

export function Login() {
  const { member, login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const state = location.state as LoginLocationState | null
  const destination = state?.from?.pathname ?? '/dashboard'

  if (member) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    try {
      await login(email, password)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to log in. Please try again.',
      )
    }
  }

  return (
    <section className="mx-auto max-w-xl px-5 py-16">
      <PageHeader
        eyebrow="Member Access"
        title="Member Login"
        description="Sign in to manage your SIDA profile and submitted work."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-zinc-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-zinc-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-zinc-950 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </section>
  )
}