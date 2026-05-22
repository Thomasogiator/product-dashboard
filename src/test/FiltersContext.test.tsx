import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FiltersProvider, useFilters } from '../lib/FiltersContext'

function FilterConsumer() {
  const { filters, page, setFilter, setPage, resetFilters } = useFilters()
  return (
    <div>
      <p data-testid="search">{filters.search}</p>
      <p data-testid="category">{filters.category}</p>
      <p data-testid="sortOrder">{filters.sortOrder}</p>
      <p data-testid="page">{page}</p>
      <button onClick={() => setFilter('search', 'laptop')}>Set search</button>
      <button onClick={() => setFilter('category', 'electronics')}>Set category</button>
      <button onClick={() => setFilter('sortOrder', 'oldest')}>Set sort oldest</button>
      <button onClick={() => setPage(3)}>Set page 3</button>
      <button onClick={resetFilters}>Reset</button>
    </div>
  )
}

function renderFilters() {
  return render(
    <FiltersProvider>
      <FilterConsumer />
    </FiltersProvider>
  )
}

describe('FiltersContext', () => {
  it('starts with default filter values', () => {
    renderFilters()
    expect(screen.getByTestId('search').textContent).toBe('')
    expect(screen.getByTestId('category').textContent).toBe('all')
    expect(screen.getByTestId('sortOrder').textContent).toBe('newest')
    expect(screen.getByTestId('page').textContent).toBe('1')
  })

  it('updates search filter', async () => {
    const user = userEvent.setup()
    renderFilters()
    await user.click(screen.getByText('Set search'))
    expect(screen.getByTestId('search').textContent).toBe('laptop')
  })

  it('updates category filter', async () => {
    const user = userEvent.setup()
    renderFilters()
    await user.click(screen.getByText('Set category'))
    expect(screen.getByTestId('category').textContent).toBe('electronics')
  })

  it('resets page to 1 when filter changes', async () => {
    const user = userEvent.setup()
    renderFilters()
    await user.click(screen.getByText('Set page 3'))
    expect(screen.getByTestId('page').textContent).toBe('3')
    await user.click(screen.getByText('Set category'))
    expect(screen.getByTestId('page').textContent).toBe('1')
  })

  it('updates sort order', async () => {
    const user = userEvent.setup()
    renderFilters()
    await user.click(screen.getByText('Set sort oldest'))
    expect(screen.getByTestId('sortOrder').textContent).toBe('oldest')
  })

  it('resets all filters to defaults', async () => {
    const user = userEvent.setup()
    renderFilters()
    await user.click(screen.getByText('Set search'))
    await user.click(screen.getByText('Set category'))
    await user.click(screen.getByText('Set page 3'))
    await user.click(screen.getByText('Reset'))
    expect(screen.getByTestId('search').textContent).toBe('')
    expect(screen.getByTestId('category').textContent).toBe('all')
    expect(screen.getByTestId('page').textContent).toBe('1')
  })
})
