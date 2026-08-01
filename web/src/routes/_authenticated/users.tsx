import { ProtectedRoute } from '#/components/protected-route'
import { UserListPage } from '#/pages/users/user-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/users')({
  component: () => (
    <ProtectedRoute roles={['ADMIN']}>
      <UserListPage />
    </ProtectedRoute>
  ),
})
