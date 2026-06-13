import { render, screen, waitFor } from '@testing-library/react'
import SystemHealthPage from '../app/admin/page'

// Mock createClient
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: { id: '1' } }, error: null }),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
      gte: jest.fn().mockReturnThis(),
      in: jest.fn().mockResolvedValue({ count: 0, error: null }),
    })),
  })),
}))

// Mock fetch for health API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ status: 'ok', supabase: 'connected', latencyMs: 45 }),
  })
) as jest.Mock

describe('Admin SystemHealthPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    render(<SystemHealthPage />)
    expect(screen.getAllByText('Checking...')[0]).toBeInTheDocument()
  })

  it('renders operational status after fetching data', async () => {
    render(<SystemHealthPage />)
    
    await waitFor(() => {
      expect(screen.getByText('All Systems Operational')).toBeInTheDocument()
    })
    
    expect(screen.getAllByText('connected')[0]).toBeInTheDocument()
    expect(screen.getAllByText('45ms')[0]).toBeInTheDocument()
  })

  it('handles degraded API health gracefully', async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ status: 'degraded', supabase: 'slow', latencyMs: 5000, error: 'High latency' }),
      })
    )
    
    render(<SystemHealthPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Partial Degradation Detected')).toBeInTheDocument()
    })
    
    expect(screen.getAllByText('High latency')[0]).toBeInTheDocument()
    expect(screen.getAllByText('5000ms')[0]).toBeInTheDocument()
  })
})
