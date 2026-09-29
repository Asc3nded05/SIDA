import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

type ProtectedRouteProps = {
  requiredRole?: 'LEADERSHIP'
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { member, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <p className="p-8 text-center">Restoring session...</p>
  }

  if (!member) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (requiredRole && member.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}