import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '#/contexts/toast-context'
import { useAuth } from '#/contexts/auth-context'
import { Logo } from '#/components/logo'
import { ErrorMessage } from '#/components/error-message'
import { apiErrorMessage } from '#/api'

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter ao menos 8 caracteres'),
  role: z.enum(['CUSTOMER', 'ADMIN']),
})

type FormValues = z.infer<typeof schema>

export function SignUpPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', role: 'CUSTOMER' },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) => registerUser(values),
    onSuccess: () => {
      toast.success('Conta criada com sucesso. Faça login para continuar.')
      navigate({ to: '/login', replace: true })
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
      <Card sx={{ width: '100%', maxWidth: 460 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Logo />
          <Typography variant="h3" sx={{ mt: 3 }}>
            Criar conta
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, mb: 3 }}
          >
            Cadastre-se para gerenciar produtos e pedidos.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit((v) => mutation.mutate(v))}
            noValidate
          >
            <Stack spacing={2.5}>
              {mutation.isError ? (
                <ErrorMessage
                  title="Falha no cadastro"
                  message={apiErrorMessage(mutation.error)}
                />
              ) : null}

              <TextField
                label="Nome"
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                {...register('name')}
              />
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
                autoComplete="new-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                {...register('password')}
              />
              <TextField
                select
                label="Perfil"
                fullWidth
                defaultValue="CUSTOMER"
                error={Boolean(errors.role)}
                helperText={errors.role?.message}
                {...register('role')}
              >
                <MenuItem value="CUSTOMER">Cliente</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </TextField>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                loading={mutation.isPending}
              >
                Criar conta
              </Button>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                Já tem conta?{' '}
                <Box
                  component="span"
                  onClick={() => navigate({ to: '/login' })}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Entrar
                </Box>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
