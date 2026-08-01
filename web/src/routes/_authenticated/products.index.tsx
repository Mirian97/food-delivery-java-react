import { ProductListPage } from '#/pages/products/product-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/products/')({
  component: ProductListPage,
})
