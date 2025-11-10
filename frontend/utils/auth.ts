export interface User {
  id: string
  email: string
  name: string
  role: 'volunteer' | 'staff' | 'admin'
  avatar?: string
}

export const AUTH_TOKEN_KEY = 'auth_token'
export const USER_KEY = 'user_data'

export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }
  return null
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}

export function setUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_KEY)
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export function hasRole(role: User['role']): boolean {
  const user = getUser()
  return user?.role === role
}

export function hasAnyRole(roles: User['role'][]): boolean {
  const user = getUser()
  return user ? roles.includes(user.role) : false
}

export async function login(email: string, password: string): Promise<User> {
  // Mock login - replace with actual API call
  const mockUser: User = {
    id: '1',
    email,
    name: 'John Doe',
    role: 'volunteer',
  }
  
  const mockToken = 'mock_jwt_token_' + Date.now()
  
  setAuthToken(mockToken)
  setUser(mockUser)
  
  return mockUser
}

export function logout(): void {
  removeAuthToken()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}
