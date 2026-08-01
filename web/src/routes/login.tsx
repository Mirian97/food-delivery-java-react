import { createFileRoute } from '@tanstack/react-router'

import { PublicLayout } from '@/layouts/public-layout'
import { LoginPage } from '@/pages/auth/login'

export const Route = createFileRoute('/login')({
  component: () => (
    <PublicLayout>
      <LoginPage />
    </PublicLayout>
  ),
})
