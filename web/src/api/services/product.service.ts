import type { Page, Product, ProductPayload } from '#/types'
import { api } from '..'

class ProductService {
  private readonly basePath = '/products'

  async list(params: {
    page: number
    size: number
    search?: string
  }): Promise<Page<Product>> {
    const { data } = await api.get<Page<Product>>(this.basePath, { params })

    return data
  }

  async byId(id: number | string): Promise<Product> {
    const { data } = await api.get<Product>(`${this.basePath}/${id}`)

    return data
  }

  async create(body: ProductPayload): Promise<Product> {
    const { data } = await api.post<Product>(this.basePath, body)

    return data
  }

  async update(id: number | string, body: ProductPayload): Promise<Product> {
    const { data } = await api.put<Product>(`${this.basePath}/${id}`, body)

    return data
  }

  async remove(id: number | string): Promise<void> {
    await api.delete(`${this.basePath}/${id}`)
  }
}

export const productService = new ProductService()
