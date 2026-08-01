import { OrderDetailsPage } from '#/pages/orders/order-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/orders/$id')({
  component: OrderDetails,
})

function OrderDetails() {
  const { id } = Route.useParams()
  return <OrderDetailsPage orderId={id} />
}
