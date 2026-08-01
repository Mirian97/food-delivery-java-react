import { getUserRole } from '#/common/helpers/get-user-role.helper'
import { PageHeader } from '@/components/page-header'
import { useAuth } from '@/contexts/auth-context'
import LogoutIcon from '@mui/icons-material/Logout'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    await queryClient.cancelQueries()
    queryClient.clear()
    logout()
    navigate({ to: '/login', replace: true })
  }

  return (
    <Box>
      <PageHeader title="Perfil" subtitle="Informações da sua conta." />
      <Card sx={{ maxWidth: 560 }}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 64,
                height: 64,
                fontSize: 26,
              }}
            >
              {(user?.name ?? user?.email ?? '?').charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5">{user?.name ?? 'Usuário'}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ my: 3 }} />
          <Stack spacing={2}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body2" color="text.secondary">
                Perfil de acesso
              </Typography>
              <Chip
                label={getUserRole(user?.role)}
                color="primary"
                size="small"
              />
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body2" color="text.secondary">
                Autenticação
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                JWT Bearer Token
              </Typography>
            </Stack>
          </Stack>
          <Button
            color="secondary"
            variant="outlined"
            sx={{ mt: 4 }}
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Sair da conta
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
