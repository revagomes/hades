import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GroupFilter } from '@/components/GroupFilter'

describe('GroupFilter', () => {
  const groups = ['all', 'work', 'personal']

  it('renders all group buttons', () => {
    render(<GroupFilter groups={groups} activeGroup="all" onSelect={vi.fn()} />)
    expect(screen.getByText('all')).toBeInTheDocument()
    expect(screen.getByText('work')).toBeInTheDocument()
    expect(screen.getByText('personal')).toBeInTheDocument()
  })

  it('highlights the active group with bg-blue-600 class', () => {
    render(<GroupFilter groups={groups} activeGroup="work" onSelect={vi.fn()} />)
    const workBtn = screen.getByText('work')
    expect(workBtn.closest('button')).toHaveClass('bg-blue-600')
  })

  it('calls onSelect when a group is clicked', () => {
    const onSelect = vi.fn()
    render(<GroupFilter groups={groups} activeGroup="all" onSelect={onSelect} />)
    fireEvent.click(screen.getByText('work'))
    expect(onSelect).toHaveBeenCalledWith('work')
  })

  it('does not apply active class to non-active groups', () => {
    render(<GroupFilter groups={groups} activeGroup="all" onSelect={vi.fn()} />)
    const workBtn = screen.getByText('work')
    expect(workBtn.closest('button')).not.toHaveClass('bg-blue-600')
  })
})
