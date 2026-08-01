import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import type { Role } from '#/types'
import { useAuth } from '#/contexts/auth-context'
import { Loading } from './loading'
import { ErrorMessage } from './error-message'

export function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode
  roles?: Role[]
}) {
  const { ready, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (ready && !isAuthenticated) {
      navigate({ to: '/login', replace: true })
    }
  }, [ready, isAuthenticated, navigate])

  if (!ready || !isAuthenticated) {
    return <Loading label="Verificando sessão..." height={400} />
  }

  if (roles && user && !roles.includes(user.role)) {
    return (
      <ErrorMessage
        title="Acesso restrito"
        message="Você não tem permissão para acessar esta área."
      />
    )
  }

  return <>{children}</>
}
