export type Role = 'ADMIN' | 'CUSTOMER'

export enum OrderStatus {
  RECEBIDO = 'RECEBIDO',
  EM_PREPARO = 'EM_PREPARO',
  SAIU_PARA_ENTREGA = 'SAIU_PARA_ENTREGA',
  ENTREGUE = 'ENTREGUE',
  CANCELADO = 'CANCELADO',
}

export const STATUSES: OrderStatus[] = Object.values(OrderStatus)

export interface AuthUser {
  name?: string | undefined
  email: string
  role: Role
}

export interface LoginResponse {
  token: string
  email: string
  role: Role
  name?: string | undefined
}

export interface RegisterResponse {
  id: number
  name: string
  email: string
  role: Role
}

export interface User {
  id: number
  name: string
  email: string
  role: Role
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  active: boolean
}

export interface ProductPayload {
  name: string
  description: string
  price: number
  active: boolean
}

export interface Page<T> {
  content: T[]
  totalElements: number
}

export interface OrderItem {
  id?: number
  productId: number
  productName?: string
  quantity: number
  unitPrice?: number
  price?: number
}

export interface Order {
  id: number
  status: OrderStatus
  deliveryAddress: string
  totalPrice: number
  createdAt?: string
  updatedAt?: string
  customerName?: string
  createdByEmail?: string
  items: OrderItem[]
}

export interface OrderPayload {
  deliveryAddress: string
  items: { productId: number; quantity: number }[]
}

export interface DashboardStats {
  ordersToday: number
  inPreparation: number
  delivered: number
  activeProducts: number
}
