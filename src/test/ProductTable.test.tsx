import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ProductTable } from '../components/products/ProductTable'
import { makeProductList, makeProduct } from './helpers'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderTable(products = makeProductList(3), isLoading = false) {
  return render(
    <MemoryRouter>
      <ProductTable products={products} isLoading={isLoading} />
    </MemoryRouter>
  )
}

describe('ProductTable', () => {
  it('renders column headers', () => {
    renderTable()
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('Brand')).toBeInTheDocument()
    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.getByText('Stock')).toBeInTheDocument()
  })

  it('renders a row for each product', () => {
    const products = makeProductList(5)
    renderTable(products)
    products.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument()
    })
  })

  it('shows skeleton rows while loading', () => {
    renderTable([], true)
    expect(screen.getByLabelText('Products loading')).toBeInTheDocument()
  })

  it('navigates to product detail on row click', async () => {
    const user = userEvent.setup()
    const product = makeProduct({ id: 42, title: 'Click Me Product' })
    renderTable([product])

    const row = screen.getByRole('button', { name: /view details for click me product/i })
    await user.click(row)

    expect(mockNavigate).toHaveBeenCalledWith('/product/42')
  })

  it('navigates on Enter key press', async () => {
    const user = userEvent.setup()
    const product = makeProduct({ id: 7, title: 'Keyboard Product' })
    renderTable([product])

    const row = screen.getByRole('button', { name: /view details for keyboard product/i })
    row.focus()
    await user.keyboard('{Enter}')

    expect(mockNavigate).toHaveBeenCalledWith('/product/7')
  })

  it('shows Out of Stock status for zero stock products', () => {
    const product = makeProduct({ stock: 0 })
    renderTable([product])
    expect(screen.getByText(/Out of Stock/)).toBeInTheDocument()
  })

  it('shows Low Stock for products with stock < 10', () => {
    const product = makeProduct({ stock: 3 })
    renderTable([product])
    expect(screen.getByText(/Low Stock/)).toBeInTheDocument()
  })

  it('displays formatted price', () => {
    const product = makeProduct({ price: 99.99, discountPercentage: 0 })
    renderTable([product])
    expect(screen.getByText('$99.99')).toBeInTheDocument()
  })
})
