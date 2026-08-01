import axios from 'axios'

export const TOKEN_KEY = 'foody.token'
export const USER_KEY = 'foody.user'

export const api = axios.create({
  baseURL: import.meta.env['VITE_API_BASE_URL'],
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_KEY)
      window.localStorage.removeItem(USER_KEY)
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export function apiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data as
        { message?: string; error?: string } | undefined
      return (
        data?.message ??
        data?.error ??
        // @ts-expect-error
        data?.detail ??
        `Erro ${error.response.status} na requisição.`
      )
    }
    return 'Não foi possível se comunicar com a API. Tente novamente mais tarde.'
  }
  return 'Ocorreu um erro inesperado.'
}
