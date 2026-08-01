import type { User } from '#/types'
import { api } from '..'

class UserService {
  private readonly basePath = '/users'

  async list(params?: { search?: string }): Promise<User[]> {
    const { data } = await api.get<User[]>(this.basePath, { params })
    return data
  }
}

export const userService = new UserService()
