/** @jest-environment node */
import { proxy } from '../proxy'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Mock next/server
jest.mock('next/server', () => {
  const original = jest.requireActual('next/server')
  return {
    ...original,
    NextResponse: {
      next: jest.fn().mockImplementation(() => {
        const res = new original.NextResponse()
        res.cookies.set = jest.fn()
        res.cookies.getAll = jest.fn(() => [])
        return res
      }),
      redirect: jest.fn().mockImplementation((url) => {
        const res = original.NextResponse.redirect(url)
        res.cookies.set = jest.fn()
        return res
      }),
    },
  }
})

// Mock Supabase SSR
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(),
}))

describe('Middleware (proxy.ts)', () => {
  const mockGetUser = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createServerClient as jest.Mock).mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
    })
  })

  const createMockRequest = (pathname: string, method = 'GET') => {
    const req = new NextRequest(`http://localhost:3000${pathname}`, { method })
    req.cookies.getAll = jest.fn(() => [])
    req.cookies.set = jest.fn()
    return req
  }

  it('should redirect unauthenticated users from /admin to /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const req = createMockRequest('/admin/cms')
    
    await proxy(req)
    
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/login' }))
  })

  it('should redirect authenticated non-admins from /admin to /', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { app_metadata: { role: 'user' } } } })
    const req = createMockRequest('/admin')
    
    await proxy(req)
    
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/' }))
  })

  it('should allow authenticated admins to access /admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { app_metadata: { role: 'admin' } } } })
    const req = createMockRequest('/admin')
    
    await proxy(req)
    
    expect(NextResponse.redirect).not.toHaveBeenCalled()
    expect(NextResponse.next).toHaveBeenCalled()
  })

  it('should redirect authenticated admins from /login to /admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { app_metadata: { role: 'admin' } } } })
    const req = createMockRequest('/login')
    
    await proxy(req)
    
    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/admin' }))
  })

  it('should NOT redirect authenticated admins making POST requests to /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { app_metadata: { role: 'admin' } } } })
    const req = createMockRequest('/login', 'POST')
    
    await proxy(req)
    
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })
})
