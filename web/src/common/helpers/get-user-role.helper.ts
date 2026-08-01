import type { Role } from '@/types'

export const getUserRole = (role?: Role): string => {
  const roles: Record<Role, string> = {
    ADMIN: 'Admin',
    CUSTOMER: 'Cliente',
  }

  return roles[role ?? 'CUSTOMER'] ?? role
}
