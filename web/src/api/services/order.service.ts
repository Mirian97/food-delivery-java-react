import type { Order, OrderPayload, OrderStatus, Page } from '#/types'
import { api } from '..'

class OrderService {
  private readonly basePath = '/orders'

  async list(params?: { page?: number; size?: number }): Promise<Page<Order>> {
    const { data } = await api.get<Page<Order> | Order[]>(this.basePath, {
      params,
    })

    if (Array.isArray(data)) {
      return {
        content: data,
        totalElements: data.length,
      }
    }

    return data
  }

  async byId(id: number | string): Promise<Order> {
    const { data } = await api.get<Order>(`${this.basePath}/${id}`)

    return data
  }

  async create(body: OrderPayload): Promise<Order> {
    const { data } = await api.post<Order>(this.basePath, body)

    return data
  }

  async updateStatus(id: number | string, status: OrderStatus): Promise<Order> {
    const { data } = await api.patch<Order>(`${this.basePath}/${id}/status`, {
      status,
    })

    return data
  }
}

export const orderService = new OrderService()
