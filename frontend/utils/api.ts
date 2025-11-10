import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Route Optimization
  async optimizeRoute(data: any) {
    return this.client.post('/api/v1/routes/optimize', data)
  }

  async optimizeVolunteerRoutes(data: any) {
    return this.client.post('/api/v1/routes/volunteer-optimization', data)
  }

  async scoreAccessibility(data: any) {
    return this.client.post('/api/v1/routes/accessibility-score', data)
  }

  async suggestVisitTimes(data: any) {
    return this.client.post('/api/v1/routes/visit-times', data)
  }

  async identifyServiceGaps(data: any) {
    return this.client.post('/api/v1/routes/service-gaps', data)
  }

  // Recommendations
  async recommendShelters(data: any) {
    return this.client.post('/api/v1/recommend/shelters', data)
  }

  async recommendJobs(data: any) {
    return this.client.post('/api/v1/recommend/jobs', data)
  }

  async recommendTraining(data: any) {
    return this.client.post('/api/v1/recommend/training', data)
  }

  async provideFeedback(data: any) {
    return this.client.post('/api/v1/feedback', data)
  }

  async getStatistics() {
    return this.client.get('/api/v1/statistics')
  }

  // Needs Assessment
  async analyzeNotes(notes: string) {
    return this.client.post('/api/v1/analyze-notes', { notes })
  }

  async startQuestionnaire(data: any) {
    return this.client.post('/api/v1/questionnaire/start', data)
  }

  async getNextQuestions(data: any) {
    return this.client.post('/api/v1/questionnaire/next', data)
  }

  async getRiskAssessment(data: any) {
    return this.client.post('/api/v1/risk-assessment', data)
  }

  // Chatbot
  async sendChatMessage(data: any) {
    return this.client.post('/api/v1/chat/message', data)
  }

  async getChatHistory(userId: string) {
    return this.client.get(`/api/v1/chat/history/${userId}`)
  }

  async clearChatHistory(userId: string) {
    return this.client.post(`/api/v1/chat/clear/${userId}`)
  }

  // Generic methods
  async get(url: string, config?: AxiosRequestConfig) {
    return this.client.get(url, config)
  }

  async post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.post(url, data, config)
  }

  async put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.client.put(url, data, config)
  }

  async delete(url: string, config?: AxiosRequestConfig) {
    return this.client.delete(url, config)
  }
}

export const api = new ApiClient()
export default api
