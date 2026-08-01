import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { useAuth } from '@/contexts/auth-context'
import { useCart } from '@/contexts/cart-context'
import { useQueryClient } from '@tanstack/react-query'
import { getUserRole } from '#/common/helpers/get-user-role.helper'

export function Navbar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const { user, isAuthenticated, logout } = useAuth()
  const { count, openCart } = useCart()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)

  const handleLogout = async () => {
    setAnchor(null)
    await queryClient.cancelQueries()
    queryClient.clear()
    logout()
    navigate({ to: '/login', replace: true })
  }

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ gap: 2 }}>
        {isAuthenticated && (
          <IconButton
            edge="start"
            onClick={onOpenSidebar}
            sx={{ display: { md: 'none' } }}
            aria-label="Abrir menu"
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate({ to: isAuthenticated ? '/dashboard' : '/' })}
        >
          <Logo />
        </Box>
        <Box sx={{ flex: 1 }} />
        <Tooltip title="Ver carrinho">
          <IconButton
            onClick={openCart}
            color="inherit"
            aria-label="Abrir carrinho de compras"
            sx={{ mr: 1 }}
          >
            <Badge badgeContent={count} color="secondary" max={99}>
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        {isAuthenticated ? (
          <>
            <Box
              sx={{
                display: { xs: 'none', sm: 'block' },
                textAlign: 'right',
                mr: 1,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.name ?? user?.email}
              </Typography>
              <Typography
                variant="caption"
                color="primary"
                sx={{ fontWeight: 700, textTransform: 'uppercase' }}
              >
                {getUserRole(user?.role)}
              </Typography>
            </Box>
            <IconButton
              onClick={(e) => setAnchor(e.currentTarget)}
              aria-label="Menu do usuário"
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 36,
                  height: 36,
                  fontSize: 15,
                }}
              >
                {(user?.name ?? user?.email ?? '?').charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchor}
              open={Boolean(anchor)}
              onClose={() => setAnchor(null)}
              slotProps={{ paper: { sx: { borderRadius: 1, minWidth: 200 } } }}
            >
              <MenuItem
                onClick={() => {
                  setAnchor(null)
                  navigate({ to: '/profile' })
                }}
              >
                <PersonOutlineIcon fontSize="small" sx={{ mr: 1.5 }} /> Perfil
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} /> Sair
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" onClick={() => navigate({ to: '/login' })}>
              Entrar
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate({ to: '/sign-up' })}
            >
              Criar conta
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
