import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(135deg, #FF5252 0%, #E53935 100%)',
          color: '#FFFFFF',
        }}
      >
        <RestaurantMenuIcon fontSize="small" />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: dark ? '#FFFFFF' : 'text.primary',
        }}
      >
        Foody
        <Box component="span" sx={{ color: 'primary.main' }}>
          Delivery
        </Box>
      </Typography>
    </Box>
  )
}
