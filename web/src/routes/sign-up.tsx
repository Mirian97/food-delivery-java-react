import { createFileRoute } from '@tanstack/react-router'

import { PublicLayout } from '#/layouts/public-layout'
import { SignUpPage } from '#/pages/auth/sign-up'

export const Route = createFileRoute('/sign-up')({
  component: () => (
    <PublicLayout>
      <SignUpPage />
    </PublicLayout>
  ),
})
