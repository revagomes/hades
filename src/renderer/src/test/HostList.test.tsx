import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HostList } from '@/components/HostList'
import type { SshHost } from '@/lib/types'

const hosts: SshHost[] = [
  { id: '1', alias: 'server.work', hostname: '10.0.0.1', user: 'deploy' },
  { id: '2', alias: 'db.work', hostname: '10.0.0.2', user: 'admin' },
  { id: '3', alias: 'myserver', hostname: '1.2.3.4', user: 'me' },
]

describe('HostList', () => {
  it('renders all hosts', () => {
    render(<HostList hosts={hosts} onEdit={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText('server.work')).toBeInTheDocument()
    expect(screen.getByText('db.work')).toBeInTheDocument()
    expect(screen.getByText('myserver')).toBeInTheDocument()
  })

  it('shows hostname and user for each row', () => {
    render(<HostList hosts={hosts} onEdit={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText('10.0.0.1')).toBeInTheDocument()
    expect(screen.getByText('deploy')).toBeInTheDocument()
  })

  it('calls onEdit with host id when edit button clicked', () => {
    const onEdit = vi.fn()
    render(<HostList hosts={hosts} onEdit={onEdit} onRemove={vi.fn()} />)
    fireEvent.click(screen.getAllByTitle('Edit')[0])
    expect(onEdit).toHaveBeenCalledWith('1')
  })

  it('calls onRemove with alias when remove button clicked', () => {
    const onRemove = vi.fn()
    render(<HostList hosts={hosts} onEdit={vi.fn()} onRemove={onRemove} />)
    fireEvent.click(screen.getAllByTitle('Remove')[0])
    expect(onRemove).toHaveBeenCalledWith('server.work')
  })

  it('shows empty state when no hosts', () => {
    render(<HostList hosts={[]} onEdit={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText(/no aliases/i)).toBeInTheDocument()
  })
})
