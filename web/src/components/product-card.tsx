import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import DeleteOutlineIcon from '@mui/icons-material/Delete'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import type { Product } from '#/types'
import { formatCurrency } from '#/common/helpers/format-currency.helper'

export function ProductCard({
  product,
  isAdmin,
  onEdit,
  onDelete,
  onAddToCart,
}: {
  product: Product
  isAdmin: boolean
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onAddToCart?: (product: Product) => void
}) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          height: 96,
          background: 'linear-gradient(135deg, #FF5252 0%, #E53935 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
        }}
      >
        <Typography
          variant="h3"
          component="span"
          sx={{ opacity: 0.9, lineClamp: 1 }}
        >
          {product.name}
        </Typography>
      </Box>
      <CardContent
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
        >
          <Typography variant="h6">{product.name}</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
          {formatCurrency(product.price)}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {isAdmin ? (
            <>
              <Button
                size="small"
                variant="outlined"
                startIcon={<EditOutlinedIcon fontSize="small" />}
                onClick={() => onEdit?.(product)}
              >
                Editar
              </Button>
              <Button
                size="small"
                color="secondary"
                startIcon={<DeleteOutlineIcon fontSize="small" />}
                onClick={() => onDelete?.(product)}
              >
                Excluir
              </Button>
            </>
          ) : (
            <Button
              size="small"
              variant="contained"
              startIcon={<AddShoppingCartIcon fontSize="small" />}
              disabled={!product.active}
              onClick={() => onAddToCart?.(product)}
            >
              Adicionar
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
