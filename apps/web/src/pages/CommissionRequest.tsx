import { useState, type FormEvent } from 'react'
import { PageHeader } from '../components/PageHeader'

const API_URL = 'http://localhost:3000/api'

export function CommissionRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const dueDate = formData.get('dueDate')?.toString().trim()

    const requestData = {
      title: formData.get('title')?.toString().trim(),
      description: formData.get('description')?.toString().trim(),
      requirements: formData.get('requirements')?.toString().trim() || undefined,
      contactName: formData.get('contactName')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      category: formData.get('category')?.toString(),
      timeline: formData.get('timeline')?.toString().trim() || undefined,
      dueDate: dueDate || undefined,
    }

    setIsSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch(`${API_URL}/commissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()

      if (!response.ok) {
        const message = Array.isArray(result.message)
          ? result.message.join(' ')
          : result.message

        throw new Error(message || 'Unable to submit your request.')
      }

      setSuccess(true)
      form.reset()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while submitting your request.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <PageHeader
        eyebrow="Work with SIDA"
        title="Request a commission"
        description="Tell us what you need, when you need it, and what kind of creative work you are looking for. Leadership will review the request and connect it with appropriate student artists."
      />

      {success && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5 text-green-800"
        >
          <h2 className="font-bold">Request submitted successfully!</h2>
          <p className="mt-1 text-sm">
            Thank you for reaching out. SIDA leadership will review your
            commission request.
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 md:p-8"
        onSubmit={handleSubmit}
      >
        <Field
          label="Project title"
          name="title"
          placeholder="e.g. Spring musical poster"
          required
        />

        <Field
          label="Project description"
          name="description"
          placeholder="Describe the project and intended audience..."
          textarea
          required
        />

        <Field
          label="Project requirements"
          name="requirements"
          placeholder="Dimensions, deliverables, brand guidelines, files, etc."
          textarea
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Field
            label="Contact name"
            name="contactName"
            placeholder="Your name"
            required
          />

          <Field
            label="Contact email"
            name="email"
            placeholder="you@school.edu"
            type="email"
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold">Work type</span>
            <select
              name="category"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-3"
              defaultValue="Graphic Design"
            >
              <option>Graphic Design</option>
              <option>Illustration / Painting</option>
              <option>Motion Design</option>
              <option>Video Editing</option>
              <option>Filming</option>
              <option>Photography</option>
              <option>Web Design</option>
              <option>Other</option>
            </select>
          </label>

          <Field label="Due date" name="dueDate" type="date" />
        </div>

        <Field
          label="Timeline / additional deadlines"
          name="timeline"
          placeholder="Tell us about milestones, rehearsals, print deadlines, etc."
          textarea
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-zinc-950 px-5 py-3 font-bold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </section>
  )
}

function Field({
  label,
  name,
  placeholder,
  textarea,
  type = 'text',
  required = false,
}: {
  label: string
  name: string
  placeholder?: string
  textarea?: boolean
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>

      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={5}
          required={required}
          className="w-full rounded-lg border border-zinc-300 px-3 py-3"
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-lg border border-zinc-300 px-3 py-3"
        />
      )}
    </label>
  )
}