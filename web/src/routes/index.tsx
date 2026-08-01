import { createFileRoute } from '@tanstack/react-router'

import { PublicLayout } from '@/layouts/public-layout'
import { LandingPage } from '@/pages/landing/landing'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Foody Delivery - Gestão de pedidos e produtos' },
      {
        name: 'description',
        content:
          'Plataforma para gerenciar catálogo, pedidos e entregas do seu delivery com indicadores em tempo real.',
      },
      {
        property: 'og:title',
        content: 'Foody Delivery - Gestão de pedidos e produtos',
      },
      {
        property: 'og:description',
        content:
          'Catálogo, pedidos e status de entrega em um painel único para o time de operação.',
      },
    ],
  }),
  component: Index,
})

function Index() {
  return (
    <PublicLayout>
      <LandingPage />
    </PublicLayout>
  )
}
