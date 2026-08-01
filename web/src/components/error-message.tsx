import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'

export function ErrorMessage({
  title = 'Não foi possível carregar os dados',
  message,
  onRetry,
}: {
  title?: string
  message: string
  onRetry?: () => void
}) {
  return (
    <Alert
      severity="error"
      sx={{ borderRadius: 1 }}
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Tentar novamente
          </Button>
        ) : undefined
      }
    >
      <AlertTitle sx={{ fontWeight: 700 }}>{title}</AlertTitle>
      {message}
    </Alert>
  )
}
