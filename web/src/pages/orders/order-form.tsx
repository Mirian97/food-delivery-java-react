import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { apiErrorMessage } from '#/api'
import { orderService } from '#/api/services/order.service'
import { productService } from '#/api/services/product.service'
import { formatCurrency } from '#/common/helpers/format-currency.helper'
import { EmptyState } from '@/components/empty-state'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { PageHeader } from '@/components/page-header'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/contexts/toast-context'

export function OrderFormPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { items, total, addItem, setQuantity, removeItem, clear } = useCart()

  const [address, setAddress] = useState('')
  const [addressError, setAddressError] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState('')

  const productsQuery = useQuery({
    queryKey: ['products', { page: 0, size: 100 }],
    queryFn: () => productService.list({ page: 0, size: 100 }),
  })

  const products = (productsQuery.data?.content ?? []).filter((p) => p.active)

  const mutation = useMutation({
    mutationFn: () =>
      orderService.create({
        deliveryAddress: address.trim(),
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      }),
    onSuccess: (order) => {
      toast.success(`Pedido #${order.id} criado com sucesso.`)
      clear()
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
      navigate({ to: '/orders/$id', params: { id: String(order.id) } })
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  })

  const submit = () => {
    if (address.trim().length < 5) {
      setAddressError('Informe o endereço de entrega completo')
      return
    }
    if (items.length === 0) {
      toast.error('Adicione ao menos um produto ao pedido.')
      return
    }
    setAddressError(null)
    mutation.mutate()
  }

  return (
    <Box>
      <PageHeader
        title="Novo pedido"
        subtitle="Monte o pedido escolhendo produtos e informando o endereço."
        action={
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate({ to: '/orders' })}
          >
            Voltar
          </Button>
        }
      />
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
            <Typography variant="h5" sx={{ mb: 2 }}>
              Itens
            </Typography>
            {productsQuery.isError ? (
              <ErrorMessage
                message={apiErrorMessage(productsQuery.error)}
                onRetry={() => void productsQuery.refetch()}
              />
            ) : productsQuery.isLoading ? (
              <Loading label="Carregando produtos..." height={140} />
            ) : (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField
                  select
                  fullWidth
                  label="Produto"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  {products.length === 0 ? (
                    <MenuItem value="" disabled>
                      Nenhum produto ativo disponível
                    </MenuItem>
                  ) : (
                    products.map((p) => (
                      <MenuItem key={p.id} value={String(p.id)}>
                        {p.name} - {formatCurrency(p.price)}
                      </MenuItem>
                    ))
                  )}
                </TextField>
                <Button
                  variant="contained"
                  sx={{ minWidth: 140 }}
                  disabled={!selectedProduct}
                  onClick={() => {
                    const product = products.find(
                      (p) => String(p.id) === selectedProduct,
                    )
                    if (product) {
                      addItem(product)
                      setSelectedProduct('')
                    }
                  }}
                >
                  Adicionar
                </Button>
              </Stack>
            )}
            <Divider sx={{ my: 3 }} />
            {items.length === 0 ? (
              <EmptyState
                title="Carrinho vazio"
                description="Selecione produtos para montar o pedido."
              />
            ) : (
              <Stack spacing={2}>
                {items.map((item) => (
                  <Stack
                    key={item.product.id}
                    direction="row"
                    spacing={2}
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(item.product.price)} cada
                      </Typography>
                    </Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <TextField
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) =>
                          setQuantity(item.product.id, Number(e.target.value))
                        }
                        slotProps={{
                          htmlInput: { min: 1, style: { width: 64 } },
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          minWidth: 90,
                          textAlign: 'right',
                        }}
                      >
                        {formatCurrency(item.product.price * item.quantity)}
                      </Typography>
                      <IconButton
                        color="secondary"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Entrega
            </Typography>
            <TextField
              label="Endereço de entrega"
              fullWidth
              multiline
              minRows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              error={Boolean(addressError)}
              helperText={addressError ?? 'Ex.: Rua X, 123 - Bairro'}
            />
            <Divider sx={{ my: 2.5 }} />
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body1">Total</Typography>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
                {formatCurrency(total)}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 2.5 }}
              loading={mutation.isPending}
              onClick={submit}
            >
              Finalizar pedido
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
