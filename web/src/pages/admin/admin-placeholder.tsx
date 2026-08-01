import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { PageHeader } from '@/components/page-header'

export function AdminPlaceholderPage({
  title,
  subtitle,
  message,
}: {
  title: string
  subtitle: string
  message: string
}) {
  return (
    <Box>
      <PageHeader title={title} subtitle={subtitle} />
      <Card sx={{ maxWidth: 640 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
