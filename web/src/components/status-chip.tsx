import type { OrderStatus } from '#/types'
import Chip from '@mui/material/Chip'

const MAP: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  RECEBIDO: { label: 'Recebido', bg: '#E3F2FD', color: '#1565C0' },
  EM_PREPARO: { label: 'Em preparo', bg: '#FFF8E1', color: '#A67C00' },
  SAIU_PARA_ENTREGA: {
    label: 'Saiu para entrega',
    bg: '#FFF1E3',
    color: '#E06A00',
  },
  ENTREGUE: { label: 'Entregue', bg: '#E8F5E9', color: '#2E7D32' },
  CANCELADO: { label: 'Cancelado', bg: '#FFEBEE', color: '#C62828' },
}

export function StatusChip({
  status,
  size = 'small',
}: {
  status: OrderStatus
  size?: 'small' | 'medium'
}) {
  const cfg = MAP[status]
  return (
    <Chip
      size={size}
      label={cfg.label}
      sx={{ bgcolor: cfg.bg, color: cfg.color, px: 0.5 }}
    />
  )
}

export const OrderStatusChip = StatusChip
