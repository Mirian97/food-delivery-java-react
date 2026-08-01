import { OrderListPage } from '#/pages/orders/order-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/orders/')({
  component: OrderListPage,
})
