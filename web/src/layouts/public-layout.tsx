import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

import { CartDrawer } from '@/components/cart-drawer'
import { Logo } from '@/components/logo'
import { Navbar } from '@/components/navbar'

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Navbar />
      <CartDrawer />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Box
        component="footer"
        sx={{ bgcolor: '#282828', color: '#FFFFFF', py: 5, mt: 8 }}
      >
        <Container maxWidth="lg">
          <Logo dark />
          <Typography variant="body2" sx={{ opacity: 0.7, mt: 1.5 }}>
            Plataforma de gestão de pedidos e produtos para operações de
            delivery.
          </Typography>
          <Typography
            variant="caption"
            sx={{ opacity: 0.5, display: 'block', mt: 2 }}
          >
            © {new Date().getFullYear()} Foody Delivery. Todos os direitos
            reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
