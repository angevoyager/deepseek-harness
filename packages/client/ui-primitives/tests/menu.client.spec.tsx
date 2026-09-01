// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { Menu, MenuItemRow } from '../src/Menu.tsx'

afterEach(cleanup)

describe('Menu children', () => {
  it('renders slot-contributed children inside the list after the native items', () => {
    render(
      <Menu
        open
        onClose={vi.fn()}
        items={[
          { id: 'alpha', label: 'Alpha' },
          { id: 'beta', label: 'Beta' },
        ]}
        onSelect={vi.fn()}
        anchor={<button type="button">Open</button>}
      >
        <MenuItemRow label="Session ID" onSelect={vi.fn()} />
      </Menu>,
    )
    const menu = screen.getByRole('menu')
    // Both the data rows and the contributed row share the menuitem role, and
    // the contributed row lands after the native items in the same viewport.
    expect(within(menu).getAllByRole('menuitem').map(row => row.textContent)).toEqual([
      'Alpha', 'Beta', 'Session ID',
    ])
  })
})

describe('MenuItemRow', () => {
  it('renders its icon and label and fires its own onSelect', () => {
    const onSelect = vi.fn()
    render(
      <MenuItemRow
        label="Session ID"
        icon={<svg data-testid="icon" />}
        onSelect={onSelect}
      />,
    )
    expect(screen.getByTestId('icon')).toBeTruthy()
    fireEvent.click(screen.getByRole('menuitem', { name: 'Session ID' }))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('applies the danger style and honors disabled', () => {
    const onSelect = vi.fn()
    render(
      <>
        <MenuItemRow label="Danger" danger onSelect={onSelect} />
        <MenuItemRow label="Disabled" disabled onSelect={onSelect} />
      </>,
    )
    expect(screen.getByRole('menuitem', { name: 'Danger' }).className).toMatch(/danger/)
    expect(screen.getByRole('menuitem', { name: 'Disabled' }).hasAttribute('disabled')).toBe(true)
  })
})
