import { ProtectedRoute } from '#/components/protected-route'
import { ProductFormPage } from '#/pages/products/product-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/products/new')({
  component: () => (
    <ProtectedRoute roles={['ADMIN']}>
      <ProductFormPage />
    </ProtectedRoute>
  ),
})
