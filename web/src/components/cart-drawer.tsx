import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from '@tanstack/react-router'
import DeleteIcon from '@mui/icons-material/Delete'
import { formatCurrency } from '#/common/helpers/format-currency.helper'
import { useCart } from '@/contexts/cart-context'

export function CartDrawer() {
  const navigate = useNavigate()
  const {
    items,
    total,
    count,
    isOpen,
    closeCart,
    setQuantity,
    removeItem,
    clear,
  } = useCart()

  const handleCheckout = () => {
    closeCart()
    navigate({ to: '/orders/new' })
  }

  const navigateToProducts = () => {
    closeCart()
    navigate({ to: '/products' })
  }

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeCart}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 400 },
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: '#FAFAFA',
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <ShoppingCartOutlinedIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Meu Carrinho
          </Typography>
          {count > 0 && (
            <Chip
              label={`${count} ${count === 1 ? 'item' : 'itens'}`}
              size="small"
              color="primary"
              sx={{ fontWeight: 600, height: 24 }}
            />
          )}
        </Stack>
        <IconButton
          onClick={closeCart}
          size="small"
          aria-label="Fechar carrinho"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
        {items.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: 280,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '50%',
                bgcolor: 'action.hover',
                mb: 2,
                display: 'inline-flex',
              }}
            >
              <ShoppingBagOutlinedIcon
                sx={{ fontSize: 48, color: 'text.disabled' }}
              />
            </Paper>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}
            >
              Seu carrinho está vazio
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: 260, mb: 3 }}>
              Explore o cardápio e adicione seus produtos favoritos para fazer
              um pedido.
            </Typography>
            <Button variant="outlined" onClick={navigateToProducts}>
              Ver produtos
            </Button>
          </Box>
        ) : (
          <Stack spacing={2}>
            {items.map((item) => (
              <Paper
                key={item.product.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  borderColor: 'divider',
                  transition: 'box-shadow 0.2s',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ pr: 1 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, lineHeight: 1.3 }}
                      >
                        {item.product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatCurrency(item.product.price)} un.
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => removeItem(item.product.id)}
                      aria-label={`Remover ${item.product.name}`}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={0.5}
                      sx={{
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1.5,
                        px: 0.5,
                        py: 0.25,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          setQuantity(item.product.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        sx={{ p: 0.5 }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography
                        variant="body2"
                        sx={{
                          minWidth: 28,
                          textAlign: 'center',
                          fontWeight: 700,
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setQuantity(item.product.id, item.quantity + 1)
                        }
                        sx={{ p: 0.5 }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    >
                      {formatCurrency(item.product.price * item.quantity)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
      {items.length > 0 && (
        <Box
          sx={{
            p: 2.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: '#FAFAFA',
          }}
        >
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                Total do Pedido
              </Typography>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
                {formatCurrency(total)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
              sx={{
                py: 1.5,
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(229, 57, 53, 0.3)',
              }}
            >
              Finalizar Pedido
            </Button>
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: 'space-between' }}
            >
              <Button
                size="small"
                color="inherit"
                onClick={closeCart}
                sx={{ opacity: 0.7 }}
              >
                Continuar comprando
              </Button>
              <Button
                size="small"
                color="error"
                onClick={clear}
                sx={{ opacity: 0.8 }}
              >
                Esvaziar
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Drawer>
  )
}
