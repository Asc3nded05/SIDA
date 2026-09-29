import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const API_URL = 'http://localhost:3000/api'
const TOKEN_KEY = 'sida_access_token'

export type Member = {
  id: string
  name: string
  email: string
  role: 'MEMBER' | 'LEADERSHIP'
  title: string | null
  bio: string | null
  disciplines: string[]
  profileImage: string | null
}

type AuthContextType = {
  member: Member | null
  accessToken: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateMember: (member: Member) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore the session when the app first loads.
  useEffect(() => {
    async function restoreSession() {
      const savedToken = sessionStorage.getItem(TOKEN_KEY)

      if (!savedToken) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('Saved session is no longer valid.')
        }

        const currentMember: Member = await response.json()

        setAccessToken(savedToken)
        setMember(currentMember)
      } catch {
        sessionStorage.removeItem(TOKEN_KEY)
        setAccessToken(null)
        setMember(null)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  async function login(email: string, password: string) {
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password.')
        }

        throw new Error(`Login failed with status ${response.status}.`)
      }

      const data: { accessToken: string; member: Member } =
        await response.json()

      sessionStorage.setItem(TOKEN_KEY, data.accessToken)
      setAccessToken(data.accessToken)
      setMember(data.member)
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY)
    setAccessToken(null)
    setMember(null)
  }

  function updateMember(updatedMember: Member) {
    setMember(updatedMember)
  }

  return (
    <AuthContext.Provider
      value={{
        member,
        accessToken,
        isLoading,
        login,
        logout,
        updateMember,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}