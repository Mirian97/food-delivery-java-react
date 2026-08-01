import { OrderFormPage } from '#/pages/orders/order-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/orders/new')({
  component: OrderFormPage,
})
