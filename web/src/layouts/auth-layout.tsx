import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { CartDrawer } from '@/components/cart-drawer'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'

const SIDEBAR_WIDTH = 264

export function AuthLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
      }}
    >
      <Navbar onOpenSidebar={() => setOpen(true)} />
      <CartDrawer />
      <Box sx={{ flex: 1, display: 'flex', height: '100%' }}>
        <Box
          component="nav"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Box
            sx={{
              position: 'sticky',
              top: 64,
              bottom: 0,
              height: 'calc(100vh - 64px)',
            }}
          >
            <Sidebar />
          </Box>
        </Box>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          sx={{ display: { md: 'none' } }}
          slotProps={{ paper: { sx: { width: SIDEBAR_WIDTH, border: 0 } } }}
        >
          <Sidebar onNavigate={() => setOpen(false)} />
        </Drawer>
        <Box component="main" sx={{ flex: 1, minWidth: 0, bgcolor: '#FCFCFD' }}>
          <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
            {children}
          </Container>
        </Box>
      </Box>
      <Box
        component="footer"
        sx={{
          bgcolor: '#282828',
          color: '#FFFFFF',
          py: 2.5,
          display: { xs: 'block', md: 'none' },
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            Foody Delivery · painel de gestão
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
