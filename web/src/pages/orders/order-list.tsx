import AddIcon from '@mui/icons-material/Add'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { apiErrorMessage } from '#/api'
import { orderService } from '#/api/services/order.service'
import { EmptyState } from '@/components/empty-state'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { OrderCard } from '@/components/order-card'
import { PageHeader } from '@/components/page-header'
import { useAuth } from '@/contexts/auth-context'
import { OrderStatus } from '@/types'

const STATUS_OPTIONS: { value: OrderStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: OrderStatus.RECEBIDO, label: 'Recebidos' },
  { value: OrderStatus.EM_PREPARO, label: 'Em preparo' },
  { value: OrderStatus.SAIU_PARA_ENTREGA, label: 'Em entrega' },
  { value: OrderStatus.ENTREGUE, label: 'Entregues' },
  { value: OrderStatus.CANCELADO, label: 'Cancelados' },
]

export function OrderListPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState<OrderStatus | 'ALL'>('ALL')

  const query = useQuery({
    queryKey: ['orders', { page: 0, size: 50 }],
    queryFn: () => orderService.list({ page: 0, size: 50 }),
  })

  const orders = useMemo(() => {
    const content = query.data?.content ?? []
    return status === 'ALL'
      ? content
      : content.filter((o) => o.status === status)
  }, [query.data, status])

  return (
    <Box>
      <PageHeader
        title={isAdmin ? 'Pedidos' : 'Meus pedidos'}
        subtitle={
          isAdmin
            ? 'Acompanhe e atualize o status de todos os pedidos.'
            : 'Histórico e status dos seus pedidos.'
        }
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate({ to: '/orders/new' })}
          >
            Novo pedido
          </Button>
        }
      />
      <Box sx={{ mb: 3, overflowX: 'auto' }}>
        <ToggleButtonGroup
          exclusive
          value={status}
          onChange={(_, value) =>
            value && setStatus(value as OrderStatus | 'ALL')
          }
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              borderRadius: 999,
              px: 2,
              textTransform: 'none',
            },
          }}
        >
          {STATUS_OPTIONS.map((option) => (
            <ToggleButton key={option.value} value={option.value}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
      {query.isError ? (
        <ErrorMessage
          message={apiErrorMessage(query.error)}
          onRetry={() => void query.refetch()}
        />
      ) : query.isLoading ? (
        <Loading label="Carregando pedidos..." />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Nenhum pedido encontrado"
          description="Assim que houver pedidos com esse filtro, eles aparecerão aqui."
          icon={<ReceiptLongOutlinedIcon fontSize="large" />}
          action={
            <Button
              variant="contained"
              onClick={() => navigate({ to: '/orders/new' })}
            >
              Criar pedido
            </Button>
          }
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr',
              xl: 'repeat(3, 1fr)',
            },
          }}
        >
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Box>
      )}
      <Stack sx={{ display: 'none' }}>
        <TextField select value="">
          <MenuItem value="">-</MenuItem>
        </TextField>
      </Stack>
    </Box>
  )
}
