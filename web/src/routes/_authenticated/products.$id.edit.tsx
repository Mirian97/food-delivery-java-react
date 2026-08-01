import { createFileRoute } from '@tanstack/react-router'

import { ProductFormPage } from '#/pages/products/product-form'
import { ProtectedRoute } from '#/components/protected-route'

export const Route = createFileRoute('/_authenticated/products/$id/edit')({
  component: EditProduct,
})

function EditProduct() {
  const { id } = Route.useParams()
  return (
    <ProtectedRoute roles={['ADMIN']}>
      <ProductFormPage productId={id} />
    </ProtectedRoute>
  )
}
