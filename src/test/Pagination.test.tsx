import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from '../components/products/Pagination'

describe('Pagination', () => {
  it('renders nothing when total fits on one page', () => {
    const { container } = render(
      <Pagination page={1} total={5} onPageChange={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('shows current page as active', () => {
    render(<Pagination page={2} total={50} onPageChange={() => {}} />)
    const page2 = screen.getByRole('button', { name: 'Page 2' })
    expect(page2).toHaveAttribute('aria-current', 'page')
  })

  it('disables previous button on first page', () => {
    render(<Pagination page={1} total={50} onPageChange={() => {}} />)
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('disables next button on last page', () => {
    render(<Pagination page={5} total={50} onPageChange={() => {}} />)
    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })

  it('calls onPageChange with correct page on button click', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={2} total={50} onPageChange={onPageChange} />)
    await user.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange when clicking a specific page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(<Pagination page={1} total={50} onPageChange={onPageChange} />)
    await user.click(screen.getByRole('button', { name: 'Page 3' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('shows total count info', () => {
    render(<Pagination page={1} total={50} onPageChange={() => {}} />)
    expect(screen.getByText(/50 products/)).toBeInTheDocument()
  })
})
