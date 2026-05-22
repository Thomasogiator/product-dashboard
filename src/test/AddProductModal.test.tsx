import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AddProductModal } from '../components/products/AddProductModal'

vi.mock('../lib/api', () => ({
  addProduct: vi.fn().mockResolvedValue({ id: 999, title: 'New Product' }),
}))

function renderModal(isOpen = true, onClose = vi.fn()) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <AddProductModal isOpen={isOpen} onClose={onClose} />
    </QueryClientProvider>
  )
}

describe('AddProductModal', () => {
  it('renders the form when open', () => {
    renderModal()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/product title/i)).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    renderModal(false)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByRole('button', { name: /add product/i }))
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    })
  })

  it('shows error when title is too short', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.type(screen.getByLabelText(/product title/i), 'ab')
    await user.tab()
    await waitFor(() => {
      expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument()
    })
  })

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderModal(true, onClose)
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when ESC is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    renderModal(true, onClose)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
