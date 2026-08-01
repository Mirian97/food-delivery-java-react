import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from '@tanstack/react-router'
import heroImage from '#/common/assets/hero-delivery.jpeg'

const FEATURES = [
  {
    icon: <DashboardOutlinedIcon />,
    title: 'Dashboard em tempo real',
    description:
      'Pedidos do dia, itens em preparo, entregas concluídas e catálogo ativo em um só lugar.',
  },
  {
    icon: <Inventory2OutlinedIcon />,
    title: 'Catálogo completo',
    description:
      'Crie, edite e desative produtos com preços e descrições sempre atualizados.',
  },
  {
    icon: <LocalShippingOutlinedIcon />,
    title: 'Status de entrega',
    description:
      'Do recebido ao entregue: acompanhe cada etapa e atualize o status em segundos.',
  },
]

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <Box>
      <Container
        maxWidth="lg"
        sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 10 } }}
      >
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 4, md: 8 },
            gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
            alignItems: 'center',
          }}
        >
          <Box>
            <Chip
              label="Plataforma de gestão de delivery"
              color="primary"
              variant="outlined"
              sx={{ mb: 2.5 }}
            />
            <Typography variant="h1" sx={{ fontSize: { xs: 38, md: 48 } }}>
              Gerencie pedidos e produtos do seu{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>
                delivery
              </Box>{' '}
              sem complicação.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 2.5, maxWidth: 520 }}
            >
              Um painel único para o time de operação: catálogo, pedidos, status
              de entrega e indicadores atualizados a cada minuto.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate({ to: '/sign-up' })}
              >
                Criar conta grátis
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate({ to: '/login' })}
              >
                Já sou cadastrado
              </Button>
            </Stack>
          </Box>
          <Box
            sx={{
              borderRadius: 6,
              overflow: 'hidden',
              boxShadow: '0 40px 80px -40px rgba(229,57,53,0.35)',
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt="Refeição pronta para entrega sobre superfície branca"
              loading="lazy"
              sx={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Box>
      </Container>
      <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 8 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          {FEATURES.map((feature) => (
            <Card key={feature.title} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: '#FFF0F0',
                    color: 'primary.main',
                    mb: 2,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6">{feature.title}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
