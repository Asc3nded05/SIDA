import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

const API_URL = 'http://localhost:3000/api'

const COMMISSION_STATUSES = [
  'SUBMITTED',
  'REVIEWING',
  'MATCHED',
  'IN_PROGRESS',
  'COMPLETED',
  'DECLINED',
] as const

type CommissionStatus = (typeof COMMISSION_STATUSES)[number]

const ALLOWED_TRANSITIONS: Record<CommissionStatus, CommissionStatus[]> = {
  SUBMITTED: ['REVIEWING', 'DECLINED'],
  REVIEWING: ['MATCHED', 'DECLINED'],
  MATCHED: ['IN_PROGRESS', 'DECLINED'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
  DECLINED: [],
}

type Member = {
  id: string
  name: string
  email: string
  title: string | null
  profileImage: string | null
}

type CommissionAssignment = {
  id: string
  assignedAt: string
  member: Member
}

type CommissionRequest = {
  id: string
  title: string
  description: string
  requirements: string | null
  contactName: string
  contactEmail: string
  category: string
  timeline: string | null
  dueDate: string | null
  status: CommissionStatus
  createdAt: string
  updatedAt: string
  assignments: CommissionAssignment[]
}

function formatStatus(status: CommissionStatus) {
  return status.replace('_', ' ')
}

function getAvailableStatuses(status: CommissionStatus) {
  return [status, ...ALLOWED_TRANSITIONS[status]]
}

export function CommissionManagement() {
  const { accessToken } = useAuth()

  const [requests, setRequests] = useState<CommissionRequest[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [assignmentProcessingId, setAssignmentProcessingId] = useState<
    string | null
  >(null)

  async function loadRequests() {
    if (!accessToken) {
      setError('You must be logged in as leadership to view commission requests.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/commissions`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Unable to load commission requests (${response.status}).`)
      }

      const data: CommissionRequest[] = await response.json()

      // Ensure requests without assignments still have an array.
      setRequests(
        data.map((request) => ({
          ...request,
          assignments: request.assignments ?? [],
        })),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while loading commission requests.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function loadMembers() {
    if (!accessToken) return

    try {
      const response = await fetch(
        `${API_URL}/commissions/assignable-members`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Unable to load assignable members (${response.status}).`)
      }

      const data: Member[] = await response.json()
      setMembers(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while loading members.',
      )
    }
  }

  useEffect(() => {
    loadRequests()
    loadMembers()
  }, [accessToken])

  async function updateStatus(
    requestId: string,
    status: CommissionStatus,
  ) {
    if (!accessToken) {
      setError('You must be logged in to update commission requests.')
      return
    }

    setProcessingId(requestId)
    setError(null)

    try {
      const response = await fetch(
        `${API_URL}/commissions/${requestId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ status }),
        },
      )

      if (!response.ok) {
        throw new Error(`Unable to update the request (${response.status}).`)
      }

      const updated: { id: string; status: CommissionStatus } =
        await response.json()

      setRequests((current) =>
        current.map((request) =>
          request.id === updated.id
            ? { ...request, status: updated.status }
            : request,
        ),
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while updating the request.',
      )
    } finally {
      setProcessingId(null)
    }
  }

  async function updateAssignment(
    requestId: string,
    memberId: string,
    isAssigned: boolean,
  ) {
    if (!accessToken) {
      setError('You must be logged in to manage assignments.')
      return
    }

    setAssignmentProcessingId(requestId)
    setError(null)

    try {
      const response = await fetch(
        isAssigned
          ? `${API_URL}/commissions/${requestId}/assignments/${memberId}`
          : `${API_URL}/commissions/${requestId}/assignments`,
        {
          method: isAssigned ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          ...(isAssigned
            ? {}
            : {
                body: JSON.stringify({ memberId }),
              }),
        },
      )

      if (!response.ok) {
        throw new Error(
          `Unable to ${isAssigned ? 'remove' : 'assign'} this artist (${response.status}).`,
        )
      }

      if (isAssigned) {
        // Remove the artist from this commission in local state.
        setRequests((current) =>
          current.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  assignments: request.assignments.filter(
                    (assignment) => assignment.member.id !== memberId,
                  ),
                }
              : request,
          ),
        )
      } else {
        // The POST endpoint returns the newly created assignment.
        const assignment: CommissionAssignment = await response.json()

        setRequests((current) =>
          current.map((request) =>
            request.id === requestId
              ? {
                  ...request,
                  assignments: [...request.assignments, assignment],
                }
              : request,
          ),
        )
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while updating the assignment.',
      )
    } finally {
      setAssignmentProcessingId(null)
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
        Leadership only
      </p>

      <h1 className="mt-2 text-5xl font-black">Commission requests</h1>

      <p className="mt-4 max-w-2xl text-zinc-600">
        Review incoming project requests, contact information, requirements,
        assignments, and current progress.
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
        <p className="mt-10 text-zinc-500">Loading commission requests...</p>
      ) : requests.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-8 text-center">
          <h2 className="text-xl font-bold">No commission requests yet</h2>
          <p className="mt-2 text-sm text-zinc-500">
            New public requests will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          {requests.map((request) => (
            <article
              key={request.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                    {request.category}
                  </p>
                  <h2 className="mt-1 text-2xl font-black">{request.title}</h2>
                  <p className="mt-2 text-sm text-zinc-500">
                    Submitted {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>

                <label className="block sm:min-w-52">
                  <span className="mb-2 block text-sm font-bold">
                    Request status
                  </span>
                  <select
                    value={request.status}
                    disabled={
                      processingId !== null ||
                      ALLOWED_TRANSITIONS[request.status].length === 0
                    }
                    onChange={(event) => {
                      const nextStatus = event.target.value as CommissionStatus

                      if (
                        window.confirm(
                          `Change this request from ${formatStatus(request.status)} to ${formatStatus(nextStatus)}?`,
                        )
                      ) {
                        updateStatus(request.id, nextStatus)
                      }
                    }}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 disabled:opacity-50"
                  >
                    {getAvailableStatuses(request.status).map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>
                  {processingId === request.id && (
                    <span className="mt-1 block text-xs text-zinc-500">
                      Updating...
                    </span>
                  )}
                </label>
              </div>

              <div className="mt-6 grid gap-6 border-t border-zinc-100 pt-5 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold">Project description</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
                    {request.description}
                  </p>

                  <h3 className="mt-5 text-sm font-bold">Requirements</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
                    {request.requirements ||
                      'No additional requirements provided.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-bold">Contact information</h3>
                  <p className="mt-2 text-sm text-zinc-600">
                    {request.contactName}
                  </p>
                  <a
                    href={`mailto:${request.contactEmail}`}
                    className="mt-1 inline-block text-sm font-semibold text-indigo-600 hover:underline"
                  >
                    {request.contactEmail}
                  </a>

                  <h3 className="mt-5 text-sm font-bold">Timeline</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-600">
                    {request.timeline || 'No timeline provided.'}
                  </p>

                  <h3 className="mt-5 text-sm font-bold">Due date</h3>
                  <p className="mt-2 text-sm text-zinc-600">
                    {request.dueDate
                      ? new Date(request.dueDate).toLocaleDateString()
                      : 'No due date provided.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-zinc-100 pt-5">
                <h3 className="text-sm font-bold">Assigned artists</h3>

                {request.assignments.length === 0 ? (
                  <p className="mt-2 text-sm text-zinc-500">
                    No artists assigned yet.
                  </p>
                ) : (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {request.assignments.map((assignment) => (
                      <li
                        key={assignment.id}
                        className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm"
                      >
                        <span className="font-semibold text-zinc-800">
                          {assignment.member.name}
                        </span>
                        {assignment.member.title && (
                          <span className="ml-2 text-zinc-500">
                            {assignment.member.title}
                          </span>
                        )}
                        <button
                          type="button"
                          disabled={assignmentProcessingId === request.id}
                          onClick={() =>
                            updateAssignment(
                              request.id,
                              assignment.member.id,
                              true,
                            )
                          }
                          className="ml-3 font-bold text-red-600 hover:text-red-800 disabled:opacity-50"
                          aria-label={`Remove ${assignment.member.name} from ${request.title}`}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5">
                  <h4 className="text-sm font-semibold">Manage assignments</h4>
                  <p className="mt-1 text-xs text-zinc-500">
                    Select one or more members to assign them to this project.
                  </p>

                  {members.length === 0 ? (
                    <p className="mt-3 text-sm text-zinc-500">
                      No assignable members available.
                    </p>
                  ) : (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {members.map((member) => {
                        const isAssigned = request.assignments.some(
                          (assignment) => assignment.member.id === member.id,
                        )

                        return (
                          <label
                            key={member.id}
                            className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 text-sm hover:bg-zinc-50"
                          >
                            <input
                              type="checkbox"
                              checked={isAssigned}
                              disabled={assignmentProcessingId === request.id}
                              onChange={() =>
                                updateAssignment(
                                  request.id,
                                  member.id,
                                  isAssigned,
                                )
                              }
                              className="h-4 w-4 accent-indigo-600"
                            />
                            <span>
                              <span className="block font-semibold text-zinc-800">
                                {member.name}
                              </span>
                              <span className="block text-xs text-zinc-500">
                                {member.title || member.email}
                              </span>
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {assignmentProcessingId === request.id && (
                    <p className="mt-2 text-xs text-zinc-500">
                      Updating assignments...
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}