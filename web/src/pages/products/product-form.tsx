import { apiErrorMessage } from '#/api'
import { productService } from '#/api/services/product.service'
import { ErrorMessage } from '@/components/error-message'
import { Loading } from '@/components/loading'
import { PageHeader } from '@/components/page-header'
import { useToast } from '@/contexts/toast-context'
import { zodResolver } from '@hookform/resolvers/zod'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Informe o nome do produto'),
  description: z.string().min(5, 'Descreva o produto'),
  price: z
    .number({ error: 'Informe um preço válido' })
    .positive('O preço deve ser maior que zero'),
  active: z.boolean(),
})

type FormValues = z.infer<typeof schema>

export function ProductFormPage({ productId }: { productId?: string }) {
  const isEdit = Boolean(productId)
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['products', productId],
    queryFn: () => productService.byId(productId!),
    enabled: isEdit,
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', price: 0, active: true },
  })

  useEffect(() => {
    if (query.data) {
      reset({
        name: query.data.name,
        description: query.data.description || '',
        price: query.data.price,
        active: query.data.active,
      })
    }
  }, [query.data, reset])

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      isEdit
        ? productService.update(productId!, values)
        : productService.create(values),
    onSuccess: () => {
      toast.success(isEdit ? 'Produto atualizado.' : 'Produto criado.')
      void queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate({ to: '/products' })
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  })

  return (
    <Box>
      <PageHeader
        title={isEdit ? 'Editar produto' : 'Novo produto'}
        subtitle="Defina as informações que aparecerão no catálogo."
        action={
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate({ to: '/products' })}
          >
            Voltar
          </Button>
        }
      />
      {isEdit && query.isLoading ? (
        <Loading label="Carregando produto..." />
      ) : isEdit && query.isError ? (
        <ErrorMessage
          message={apiErrorMessage(query.error)}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <Card sx={{ maxWidth: 640 }}>
          <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Box
              component="form"
              onSubmit={handleSubmit((v) => mutation.mutate(v))}
              noValidate
            >
              <Stack spacing={2.5}>
                {mutation.isError ? (
                  <ErrorMessage
                    title="Não foi possível salvar"
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
                  label="Descrição"
                  fullWidth
                  multiline
                  minRows={3}
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                  {...register('description')}
                />
                <TextField
                  label="Preço (R$)"
                  type="number"
                  fullWidth
                  slotProps={{ htmlInput: { step: '0.01', min: '0' } }}
                  error={Boolean(errors.price)}
                  helperText={errors.price?.message}
                  {...register('price', { valueAsNumber: true })}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('active')}
                      onChange={(e) => setValue('active', e.target.checked)}
                    />
                  }
                  label="Produto ativo"
                />

                <Stack direction="row" spacing={1.5}>
                  <Button
                    type="submit"
                    variant="contained"
                    loading={mutation.isPending}
                  >
                    {isEdit ? 'Salvar alterações' : 'Criar produto'}
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate({ to: '/products' })}
                  >
                    Cancelar
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
