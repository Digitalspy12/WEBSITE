/** @jest-environment node */
import { GET as getHealth } from '../app/api/health/route'
import { GET as getAudit } from '../app/api/admin/audit/route'
import { GET as getLogs } from '../app/api/logs/route'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/require-admin'

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/lib/require-admin', () => ({
  requireAdmin: jest.fn(),
}))

describe('API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('/api/health', () => {
    it('should return 200 and ok status when Supabase connects', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ error: null }),
      }
        ; (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const res = await getHealth()
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.status).toBe('ok')
      expect(data.supabase).toBe('connected')
    })

    it('should return 503 when Supabase fails', async () => {
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ error: { message: 'DB Down' } }),
      }
        ; (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const res = await getHealth()
      const data = await res.json()

      expect(res.status).toBe(503)
      expect(data.status).toBe('degraded')
      expect(data.error).toBe('DB Down')
    })
  })

  describe('/api/admin/audit', () => {
    it('should return 401 if unauthorized', async () => {
      ; (requireAdmin as jest.Mock).mockResolvedValue({ error: 'Unauthorized', status: 401 })

      const res = await getAudit()
      const data = await res.json()

      expect(res.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return audit logs if authorized', async () => {
      ; (requireAdmin as jest.Mock).mockResolvedValue({ user: { id: '123' } })

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [{ action: 'login' }], count: 1, error: null }),
      }
        ; (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const res = await getAudit()
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.logs[0].action).toBe('login')
      expect(data.total).toBe(1)
    })
  })

  describe('/api/logs', () => {
    const createMockRequest = (url: string) => {
      return { url } as unknown as NextRequest
    }

    it('should return 401 if unauthorized', async () => {
      ; (requireAdmin as jest.Mock).mockResolvedValue({ error: 'Unauthorized', status: 401 })

      const res = await getLogs(createMockRequest('http://localhost/api/logs'))
      expect(res.status).toBe(401)
    })

    it('should return app logs if authorized', async () => {
      ; (requireAdmin as jest.Mock).mockResolvedValue({ user: { id: '123' } })

      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockResolvedValue({ data: [{ level: 'error' }], count: 1, error: null }),
      }
        ; (createClient as jest.Mock).mockResolvedValue(mockSupabase)

      const res = await getLogs(createMockRequest('http://localhost/api/logs'))
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data.logs[0].level).toBe('error')
    })
  })
})
