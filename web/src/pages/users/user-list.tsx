import { apiErrorMessage } from '#/api'
import { userService } from '#/api/services/user.service'
import { getUserRole } from '#/common/helpers/get-user-role.helper'
import { EmptyState } from '@/components/empty-state'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { PageHeader } from '@/components/page-header'
import type { Role, User } from '@/types'
import SearchIcon from '@mui/icons-material/Search'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

export function UserListPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | Role>('ALL')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 400)

    return () => clearTimeout(timer)
  }, [search])

  const query = useQuery({
    queryKey: ['users', debouncedSearch || undefined],
    queryFn: () => userService.list({ search: debouncedSearch || undefined }),
  })
  const users = query.data ?? []

  const filteredUsers = useMemo(() => {
    return users.filter((u) => roleFilter === 'ALL' || u.role === roleFilter)
  }, [users, roleFilter])

  const columns: GridColDef<User>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      valueFormatter: (value: number) => `#${value}`,
    },
    {
      field: 'name',
      headerName: 'Usuário',
      flex: 1.2,
      minWidth: 200,
      renderCell: (params) => (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', height: '100%' }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: 14,
              bgcolor:
                params.row.role === 'ADMIN' ? 'secondary.main' : 'primary.main',
              fontWeight: 600,
            }}
          >
            {params.row.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.row.name}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'email',
      headerName: 'E-mail',
      flex: 1.5,
      minWidth: 220,
    },
    {
      field: 'role',
      headerName: 'Perfil de Acesso',
      width: 180,
      renderCell: (params) => {
        const isAdmin = params.value === 'ADMIN'
        return (
          <Chip
            size="small"
            label={getUserRole(params.value)}
            sx={{
              fontWeight: 600,
              bgcolor: isAdmin ? '#E8EAF6' : '#E8F5E9',
              color: isAdmin ? '#283593' : '#2E7D32',
            }}
          />
        )
      },
    },
  ]

  return (
    <Box>
      <PageHeader
        title="Usuários"
        subtitle="Gestão de contas e perfis de acesso cadastrados na plataforma."
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 3, justifyContent: 'space-between' }}
      >
        <TextField
          placeholder="Buscar por nome ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ maxWidth: 320, width: '100%' }}
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
        <TextField
          select
          size="small"
          label="Perfil"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'ALL' | Role)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="ALL">Todos os perfis</MenuItem>
          <MenuItem value="ADMIN">Administradores</MenuItem>
          <MenuItem value="CUSTOMER">Clientes</MenuItem>
        </TextField>
      </Stack>
      {query.isError ? (
        <ErrorMessage
          message={apiErrorMessage(query.error)}
          onRetry={() => void query.refetch()}
        />
      ) : query.isLoading ? (
        <Loading label="Carregando lista de usuários..." />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title="Nenhum usuário encontrado"
          description={
            search || roleFilter !== 'ALL'
              ? 'Tente ajustar os filtros de busca.'
              : 'Nenhum usuário cadastrado na plataforma.'
          }
        />
      ) : (
        <Card sx={{ p: 1 }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
          />
        </Card>
      )}
    </Box>
  )
}
