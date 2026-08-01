import type { LoginResponse, RegisterResponse } from '#/types'
import { api } from '..'

class AuthService {
  private readonly basePath = '/auth'

  async login(body: {
    email: string
    password: string
  }): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(
      `${this.basePath}/login`,
      body,
    )

    return data
  }

  async register(body: {
    name: string
    email: string
    password: string
  }): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>(
      `${this.basePath}/register`,
      body,
    )

    return data
  }
}

export const authService = new AuthService()
