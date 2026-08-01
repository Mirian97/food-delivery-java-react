import { Outlet, createFileRoute } from '@tanstack/react-router'

import { AuthLayout } from '@/layouts/auth-layout'
import { ProtectedRoute } from '#/components/protected-route'

export const Route = createFileRoute('/_authenticated')({
  ssr: false,
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <ProtectedRoute>
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    </ProtectedRoute>
  )
}
