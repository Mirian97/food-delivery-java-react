import type { User } from '#/types'
import { api } from '..'

class UserService {
  private readonly basePath = '/users'

  async list(): Promise<User[]> {
    const { data } = await api.get<User[]>(this.basePath)
    return data
  }
}

export const userService = new UserService()
