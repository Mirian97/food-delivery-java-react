import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { apiErrorMessage } from '#/api'
import { productService } from '#/api/services/product.service'
import { formatCurrency } from '#/common/helpers/format-currency.helper'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { EmptyState } from '@/components/empty-state'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { PageHeader } from '@/components/page-header'
import { ProductCard } from '@/components/product-card'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/contexts/toast-context'
import type { Product } from '@/types'

export function ProductListPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { addItem, count, total, openCart } = useCart()

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [toDelete, setToDelete] = useState<Product | null>(null)

  const query = useQuery({
    queryKey: ['products', { page, size: pageSize }],
    queryFn: () => productService.list({ page, size: pageSize }),
  })

  const removeMutation = useMutation({
    mutationFn: (id: number) => productService.remove(id),
    onSuccess: () => {
      toast.success('Produto excluído.')
      setToDelete(null)
      void queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  })

  const rows = useMemo(() => {
    const content = query.data?.content ?? []
    const term = search.trim().toLowerCase()
    if (!term) return content
    return content.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    )
  }, [query.data, search])

  const columns: GridColDef<Product>[] = [
    { field: 'name', headerName: 'Produto', flex: 1, minWidth: 160 },
    { field: 'description', headerName: 'Descrição', flex: 1.4, minWidth: 200 },
    {
      field: 'price',
      headerName: 'Preço',
      width: 130,
      valueFormatter: (value: number) => formatCurrency(value),
    },
    {
      field: 'active',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value ? 'Ativo' : 'Inativo'}
          sx={{
            bgcolor: params.value ? '#E8F5E9' : '#F5F5F5',
            color: params.value ? '#2E7D32' : '#757575',
          }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      filterable: false,
      headerAlign: 'center',
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() =>
                navigate({
                  to: '/products/$id/edit',
                  params: { id: String(params.row.id) },
                })
              }
            >
              <ModeEditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              size="small"
              color="secondary"
              onClick={() => setToDelete(params.row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ]

  return (
    <Box sx={{ pb: !isAdmin && count > 0 ? 10 : 0 }}>
      <PageHeader
        title="Produtos"
        subtitle={
          isAdmin
            ? 'Gerencie o catálogo da operação.'
            : 'Escolha os itens do seu pedido.'
        }
        action={
          isAdmin ? (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate({ to: '/products/new' })}
            >
              Adicionar produto
            </Button>
          ) : undefined
        }
      />
      <TextField
        placeholder="Buscar produtos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, maxWidth: 320, width: '100%' }}
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
      {query.isError ? (
        <ErrorMessage
          message={apiErrorMessage(query.error)}
          onRetry={() => void query.refetch()}
        />
      ) : query.isLoading ? (
        <Loading label="Carregando produtos..." />
      ) : rows.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          description={
            search
              ? 'Tente ajustar sua busca.'
              : 'Cadastre o primeiro produto do catálogo.'
          }
          action={
            isAdmin ? (
              <Button
                variant="contained"
                onClick={() => navigate({ to: '/products/new' })}
              >
                Adicionar produto
              </Button>
            ) : undefined
          }
        />
      ) : isAdmin ? (
        <Card sx={{ p: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            rowCount={query.data?.totalElements ?? rows.length}
            paginationMode="server"
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={(model) => {
              setPage(model.page)
              setPageSize(model.pageSize)
            }}
            pageSizeOptions={[5, 10, 25]}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'red',
              },
            }}
          />
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            },
          }}
        >
          {rows.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isAdmin={false}
              onAddToCart={(p) => {
                addItem(p)
                toast.success(`${p.name} adicionado ao carrinho.`)
              }}
            />
          ))}
        </Box>
      )}
      {!isAdmin && count > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            left: { xs: 16, sm: 'auto' },
            zIndex: 1100,
            p: 2,
            bgcolor: '#282828',
            color: '#FFFFFF',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            maxWidth: { sm: 460 },
            width: '100%',
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Badge badgeContent={count} color="primary">
              <ShoppingCartOutlinedIcon
                sx={{ color: '#FFFFFF', fontSize: 28 }}
              />
            </Badge>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}
              >
                {count} {count === 1 ? 'item' : 'itens'} no carrinho
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}
              >
                Total: {formatCurrency(total)}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={openCart}
              sx={{
                color: '#FFFFFF',
                borderColor: 'rgba(255,255,255,0.4)',
                '&:hover': {
                  borderColor: '#FFFFFF',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Ver carrinho
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate({ to: '/orders/new' })}
              sx={{ fontWeight: 700, px: 2 }}
            >
              Finalizar
            </Button>
          </Stack>
        </Paper>
      )}
      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Excluir produto"
        description={`Tem certeza que deseja excluir "${toDelete?.name}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        loading={removeMutation.isPending}
        onClose={() => setToDelete(null)}
        onConfirm={() => toDelete && removeMutation.mutate(toDelete.id)}
      />
    </Box>
  )
}
