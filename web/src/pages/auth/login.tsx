import { zodResolver } from '@hookform/resolvers/zod'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { apiErrorMessage } from '@/api'
import { ErrorMessage } from '@/components/error-message'
import { Logo } from '@/components/logo'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/contexts/toast-context'

const schema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter ao menos 8 caracteres'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) => login(values.email, values.password),
    onSuccess: (user) => {
      toast.success(`Bem-vindo, ${user.name ?? user.email}!`)
      navigate({ to: '/dashboard', replace: true })
    },
  })

  return (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        py: { xs: 6, md: 10 },
        px: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 440 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Logo />
          <Typography variant="h3" sx={{ mt: 3 }}>
            Entrar
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, mb: 3 }}
          >
            Acesse o painel de gestão da sua operação.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit((v) => mutation.mutate(v))}
            noValidate
          >
            <Stack spacing={2.5}>
              {mutation.isError && (
                <ErrorMessage
                  title="Falha no login"
                  message={apiErrorMessage(mutation.error)}
                />
              )}
              <TextField
                label="E-mail"
                type="email"
                fullWidth
                autoComplete="email"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register('email')}
              />
              <TextField
                label="Senha"
                type="password"
                fullWidth
                autoComplete="current-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                {...register('password')}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                loading={mutation.isPending}
              >
                Entrar
              </Button>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                Não tem conta?{' '}
                <Box
                  component="span"
                  onClick={() => navigate({ to: '/sign-up' })}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Criar conta
                </Box>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
