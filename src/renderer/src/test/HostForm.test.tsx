import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HostForm } from '@/components/HostForm'
import type { SshHost } from '@/lib/types'

vi.stubGlobal('sshconfig', { pickKeyFile: vi.fn().mockResolvedValue('/home/user/.ssh/id_ed25519') })

const onSave = vi.fn()
const onCancel = vi.fn()

beforeEach(() => { vi.clearAllMocks() })

describe('HostForm — add mode', () => {
  it('renders empty alias field in add mode', () => {
    render(<HostForm mode="add" host={null} onSave={onSave} onCancel={onCancel} />)
    expect(screen.getByPlaceholderText(/alias/i)).toHaveValue('')
  })

  it('calls onSave with new host data when form is submitted', async () => {
    render(<HostForm mode="add" host={null} onSave={onSave} onCancel={onCancel} />)
    fireEvent.change(screen.getByPlaceholderText(/alias/i), { target: { value: 'myhost' } })
    fireEvent.change(screen.getByPlaceholderText(/hostname/i), { target: { value: '1.2.3.4' } })
    fireEvent.change(screen.getByPlaceholderText(/user/i), { target: { value: 'deploy' } })
    fireEvent.click(screen.getByText(/save/i))
    await waitFor(() => expect(onSave).toHaveBeenCalled())
    const saved = onSave.mock.calls[0][0]
    expect(saved.alias).toBe('myhost')
    expect(saved.hostname).toBe('1.2.3.4')
    expect(saved.user).toBe('deploy')
  })

  it('does not call onSave when alias is empty', () => {
    render(<HostForm mode="add" host={null} onSave={onSave} onCancel={onCancel} />)
    fireEvent.click(screen.getByText(/save/i))
    expect(onSave).not.toHaveBeenCalled()
  })

  it('calls onCancel when cancel is clicked', () => {
    render(<HostForm mode="add" host={null} onSave={onSave} onCancel={onCancel} />)
    fireEvent.click(screen.getByText(/cancel/i))
    expect(onCancel).toHaveBeenCalled()
  })
})

describe('HostForm — edit mode', () => {
  const host: SshHost = {
    id: 'abc-123',
    alias: 'myhost',
    hostname: '1.2.3.4',
    user: 'deploy',
  }

  it('pre-fills fields with existing host data', () => {
    render(<HostForm mode="edit" host={host} onSave={onSave} onCancel={onCancel} />)
    expect(screen.getByDisplayValue('myhost')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1.2.3.4')).toBeInTheDocument()
    expect(screen.getByDisplayValue('deploy')).toBeInTheDocument()
  })

  it('passes the original id on save', async () => {
    render(<HostForm mode="edit" host={host} onSave={onSave} onCancel={onCancel} />)
    fireEvent.click(screen.getByText(/save/i))
    await waitFor(() => expect(onSave).toHaveBeenCalled())
    expect(onSave.mock.calls[0][0].id).toBe('abc-123')
  })

  it('alias field is disabled in edit mode', () => {
    render(<HostForm mode="edit" host={host} onSave={onSave} onCancel={onCancel} />)
    expect(screen.getByDisplayValue('myhost')).toBeDisabled()
  })
})
