import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from '@tanstack/react-router'
import { formatCurrency } from '#/common/helpers/format-currency.helper'
import { formatDateTime } from '#/common/helpers/format-datetime.helper'
import type { Order } from '#/types'
import { StatusChip } from '@/components/status-chip'

export function OrderCard({ order }: { order: Order }) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' } }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <ReceiptLongOutlinedIcon color="primary" />
            <Typography variant="h6">Pedido #{order.id}</Typography>
          </Stack>
          <StatusChip status={order.status} />
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={0.75}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', color: 'text.secondary' }}
          >
            <PlaceOutlinedIcon fontSize="small" />
            <Typography variant="body2">{order.deliveryAddress}</Typography>
          </Stack>
          {order.createdByEmail || order.customerName ? (
            <Typography variant="body2" color="text.secondary">
              Cliente: {order.createdByEmail || order.customerName}
            </Typography>
          ) : null}
          <Typography variant="body2" color="text.secondary">
            {formatDateTime(order.createdAt)} · {order.items.length || 0}{' '}
            item(ns)
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{ mt: 2, alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
            {formatCurrency(order.totalPrice)}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              navigate({ to: '/orders/$id', params: { id: String(order.id) } })
            }
          >
            Ver detalhes
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
