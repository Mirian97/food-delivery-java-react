import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { useAuth } from '@/contexts/auth-context'

interface NavItem {
  label: string
  to: string
  icon: ReactNode
}

const ADMIN_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardOutlinedIcon /> },
  { label: 'Produtos', to: '/products', icon: <Inventory2OutlinedIcon /> },
  { label: 'Pedidos', to: '/orders', icon: <ReceiptLongOutlinedIcon /> },
  { label: 'Usuários', to: '/users', icon: <GroupOutlinedIcon /> },
]

const CUSTOMER_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardOutlinedIcon /> },
  { label: 'Produtos', to: '/products', icon: <Inventory2OutlinedIcon /> },
  { label: 'Meus pedidos', to: '/orders', icon: <ReceiptLongOutlinedIcon /> },
  { label: 'Perfil', to: '/profile', icon: <PersonOutlineIcon /> },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { isAdmin, user } = useAuth()
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const items = isAdmin ? ADMIN_ITEMS : CUSTOMER_ITEMS

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#282828',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        px: 2,
        py: 3,
      }}
    >
      <Typography variant="overline" sx={{ opacity: 0.6, px: 1 }}>
        {isAdmin ? 'Administração' : 'Minha conta'}
      </Typography>
      <List sx={{ mt: 1, flex: 1 }}>
        {items.map((item) => {
          const active =
            pathname === item.to || pathname.startsWith(`${item.to}/`)
          return (
            <ListItemButton
              key={item.to}
              selected={active}
              onClick={() => {
                navigate({ to: item.to })
                onNavigate?.()
              }}
              sx={{
                borderRadius: 3,
                mb: 0.5,
                color: active ? '#FFFFFF' : 'rgba(255,255,255,0.72)',
                bgcolor: active ? 'primary.main' : 'transparent',
                '&.Mui-selected': { bgcolor: 'primary.main' },
                '&.Mui-selected:hover': { bgcolor: 'secondary.main' },
                '&:hover': {
                  bgcolor: active ? 'secondary.main' : 'rgba(255,255,255,0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: { sx: { fontSize: 15, fontWeight: 600 } },
                }}
              />
            </ListItemButton>
          )
        })}
      </List>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 2 }} />
      <Box sx={{ px: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {user?.name ?? user?.email}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.6 }}>
          {user?.role}
        </Typography>
      </Box>
    </Box>
  )
}
