import { apiErrorMessage } from '#/api'
import { orderService } from '#/api/services/order.service'
import { formatCurrency } from '#/common/helpers/format-currency.helper'
import { formatDateTime } from '#/common/helpers/format-datetime.helper'
import type { OrderStatus } from '#/types'
import { STATUSES } from '#/types'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { PageHeader } from '@/components/page-header'
import { StatusChip } from '@/components/status-chip'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/contexts/toast-context'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export function OrderDetailsPage({ orderId }: { orderId: string }) {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const [nextStatus, setNextStatus] = useState<OrderStatus | ''>('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const query = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => orderService.byId(orderId),
  })

  useEffect(() => {
    if (query.data) setNextStatus(query.data.status)
  }, [query.data])

  const statusMutation = useMutation({
    mutationFn: (status: OrderStatus) =>
      orderService.updateStatus(orderId, status),
    onSuccess: () => {
      toast.success('Status atualizado.')
      setConfirmOpen(false)
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  })

  const order = query.data

  return (
    <Box>
      <PageHeader
        title={`Pedido #${orderId}`}
        subtitle="Detalhes, itens e histórico de status."
        action={
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate({ to: '/orders' })}
          >
            Voltar
          </Button>
        }
      />
      {query.isLoading ? (
        <Loading label="Carregando pedido..." />
      ) : query.isError || !order ? (
        <ErrorMessage
          message={apiErrorMessage(query.error)}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
            alignItems: 'start',
          }}
        >
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Typography variant="h5">Itens do pedido</Typography>
                <StatusChip status={order.status} size="medium" />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={2}>
                {order.items.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum item retornado pela API para este pedido.
                  </Typography>
                ) : (
                  order.items.map((item, index) => (
                    <Stack
                      key={item.id ?? `${item.productId}-${index}`}
                      direction="row"
                      spacing={2}
                      sx={{ justifyContent: 'space-between' }}
                    >
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {item.productName ?? `Produto #${item.productId}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantidade: {item.quantity}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {formatCurrency(
                          (item.unitPrice ?? item.price ?? 0) * item.quantity,
                        )}
                      </Typography>
                    </Stack>
                  ))
                )}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Typography variant="h6">Total</Typography>
                <Typography
                  variant="h5"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  {formatCurrency(order.totalPrice)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          <Stack spacing={2.5}>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Typography variant="h6">Entrega</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {order.deliveryAddress}
                </Typography>
                {order.createdByEmail ||
                  (order.customerName && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Cliente: {order.createdByEmail || order.customerName}
                    </Typography>
                  ))}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                >
                  Criado em {formatDateTime(order.createdAt)}
                </Typography>
              </CardContent>
            </Card>
            {isAdmin ? (
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Atualizar status
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    value={nextStatus}
                    onChange={(e) =>
                      setNextStatus(e.target.value as OrderStatus)
                    }
                  >
                    {STATUSES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s.replaceAll('_', ' ')}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={!nextStatus || nextStatus === order.status}
                    onClick={() => setConfirmOpen(true)}
                  >
                    Salvar status
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </Stack>
        </Box>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Atualizar status"
        description={`Confirmar mudança do pedido #${orderId} para "${String(nextStatus).replaceAll('_', ' ')}"?`}
        loading={statusMutation.isPending}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => nextStatus && statusMutation.mutate(nextStatus)}
      />
    </Box>
  )
}
