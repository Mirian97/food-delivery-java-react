import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { apiErrorMessage } from '#/api'
import { orderService } from '#/api/services/order.service'
import { productService } from '#/api/services/product.service'
import { EmptyState } from '@/components/empty-state'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { OrderCard } from '@/components/order-card'
import { PageHeader } from '@/components/page-header'
import { useAuth } from '@/contexts/auth-context'
import { StatCard } from '#/components/stat-card'

export function DashboardPage() {
  const { isAdmin, user } = useAuth()
  const navigate = useNavigate()

  const ordersQuery = useQuery({
    queryKey: ['orders', { page: 0, size: 100 }],
    queryFn: () => orderService.list({ page: 0, size: 100 }),
  })

  const productsQuery = useQuery({
    queryKey: ['products', { page: 0, size: 100 }],
    queryFn: () => productService.list({ page: 0, size: 100 }),
  })

  const orders = ordersQuery.data?.content ?? []
  const products = productsQuery.data?.content ?? []

  const today = new Date().toDateString()
  const ordersToday = orders.filter((o) =>
    o.createdAt ? new Date(o.createdAt).toDateString() === today : true,
  ).length
  const inPreparation = orders.filter((o) => o.status === 'EM_PREPARO').length
  const delivered = orders.filter((o) => o.status === 'ENTREGUE').length
  const activeProducts = products.filter((p) => p.active).length

  const isLoading = ordersQuery.isLoading || productsQuery.isLoading
  const error = ordersQuery.error ?? productsQuery.error
  const userName = user?.name?.split(' ')[0] ?? user?.email ?? ''

  return (
    <Box>
      <PageHeader
        title={`Olá, ${userName}`}
        subtitle={
          isAdmin
            ? 'Visão geral da operação de delivery.'
            : 'Acompanhe seus pedidos e descubra novidades no menu.'
        }
        action={
          <Button
            variant="contained"
            onClick={() => navigate({ to: '/orders' })}
          >
            {isAdmin ? 'Ver pedidos' : 'Fazer pedido'}
          </Button>
        }
      />

      {error ? (
        <ErrorMessage
          message={apiErrorMessage(error)}
          onRetry={() => {
            void ordersQuery.refetch()
            void productsQuery.refetch()
          }}
        />
      ) : isLoading ? (
        <Loading label="Carregando indicadores..." />
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gap: 2.5,
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                lg: 'repeat(4, 1fr)',
              },
            }}
          >
            <StatCard
              label="Pedidos hoje"
              value={ordersToday}
              accent="#FF5252"
              icon={<ReceiptLongOutlinedIcon />}
            />
            <StatCard
              label="Em preparo"
              value={inPreparation}
              accent="#F0A800"
              icon={<RestaurantOutlinedIcon />}
            />
            <StatCard
              label="Entregues"
              value={delivered}
              accent="#2E7D32"
              icon={<LocalShippingOutlinedIcon />}
            />
            <StatCard
              label="Produtos ativos"
              value={activeProducts}
              accent="#282828"
              icon={<Inventory2OutlinedIcon />}
            />
          </Box>
          <Typography variant="h3" sx={{ mt: 5, mb: 2 }}>
            {isAdmin ? 'Pedidos recentes' : 'Meus últimos pedidos'}
          </Typography>
          {orders.length === 0 ? (
            <EmptyState
              title="Nenhum pedido ainda"
              description="Quando novos pedidos chegarem, eles aparecerão aqui."
              icon={<ReceiptLongOutlinedIcon fontSize="large" />}
              action={
                <Button
                  variant="contained"
                  onClick={() => navigate({ to: '/products' })}
                >
                  Ver produtos
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
              {orders.slice(0, 6).map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  )
}
