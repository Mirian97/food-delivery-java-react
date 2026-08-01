import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3,
        py: 6,
        px: 3,
        textAlign: 'center',
        bgcolor: '#FCFCFC',
      }}
    >
      {icon ? <Box sx={{ color: 'primary.main', mb: 1.5 }}>{icon}</Box> : null}
      <Typography variant="h6">{title}</Typography>
      {description ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, mb: 2 }}
        >
          {description}
        </Typography>
      ) : null}
      {action}
    </Box>
  )
}
