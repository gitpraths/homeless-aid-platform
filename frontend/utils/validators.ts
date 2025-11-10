export const validators = {
  email: (value: string): string | true => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) || 'Invalid email address'
  },

  required: (value: any): string | true => {
    return (value !== undefined && value !== null && value !== '') || 'This field is required'
  },

  minLength: (min: number) => (value: string): string | true => {
    return value.length >= min || `Minimum ${min} characters required`
  },

  maxLength: (max: number) => (value: string): string | true => {
    return value.length <= max || `Maximum ${max} characters allowed`
  },

  phone: (value: string): string | true => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return phoneRegex.test(value) || 'Invalid phone number'
  },

  age: (value: number): string | true => {
    return (value >= 0 && value <= 120) || 'Invalid age'
  },

  url: (value: string): string | true => {
    try {
      new URL(value)
      return true
    } catch {
      return 'Invalid URL'
    }
  },

  coordinates: (lat: number, lon: number): string | true => {
    const validLat = lat >= -90 && lat <= 90
    const validLon = lon >= -180 && lon <= 180
    return (validLat && validLon) || 'Invalid coordinates'
  },
}

export function validateForm(data: Record<string, any>, rules: Record<string, Function[]>): Record<string, string> {
  const errors: Record<string, string> = {}

  Object.keys(rules).forEach((field) => {
    const value = data[field]
    const fieldRules = rules[field]

    for (const rule of fieldRules) {
      const result = rule(value)
      if (result !== true) {
        errors[field] = result
        break
      }
    }
  })

  return errors
}
