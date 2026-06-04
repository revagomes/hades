import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useShellStore } from '@/store/useShellStore'

const mockBridge = {
  init: vi.fn(),
  list: vi.fn(),
  get: vi.fn(),
  add: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  rebuild: vi.fn(),
  pickKeyFile: vi.fn(),
}

vi.stubGlobal('window', { sshconfig: mockBridge })

beforeEach(() => {
  vi.resetAllMocks()
  useShellStore.setState({
    hosts: [],
    activeGroup: 'all',
    groups: ['all'],
    form: { mode: null, hostId: null },
    lastError: null,
  })
})

describe('loadHosts', () => {
  it('populates hosts from IPC', async () => {
    mockBridge.list.mockResolvedValue(['alpha'])
    mockBridge.get.mockResolvedValue('# id: abc-123\nHost alpha\n  Hostname 1.2.3.4\n  User deploy\n')
    const { result } = renderHook(() => useShellStore())
    await act(() => result.current.loadHosts())
    expect(result.current.hosts).toHaveLength(1)
    expect(result.current.hosts[0].alias).toBe('alpha')
    expect(result.current.hosts[0].hostname).toBe('1.2.3.4')
  })

  it('calls init and retries when ENOT_INITIALIZED', async () => {
    const err = Object.assign(new Error('not init'), { code: 'ENOT_INITIALIZED' })
    mockBridge.list.mockRejectedValueOnce(err).mockResolvedValueOnce([])
    mockBridge.init.mockResolvedValue(undefined)
    const { result } = renderHook(() => useShellStore())
    await act(() => result.current.loadHosts())
    expect(mockBridge.init).toHaveBeenCalled()
    expect(result.current.hosts).toHaveLength(0)
  })
})

describe('group derivation', () => {
  it('derives groups from host dot-prefixes', async () => {
    mockBridge.list.mockResolvedValue(['server.work', 'db.work', 'myserver'])
    mockBridge.get.mockImplementation((alias: string) =>
      Promise.resolve(`# id: ${alias}\nHost ${alias}\n  Hostname 1.2.3.4\n`)
    )
    const { result } = renderHook(() => useShellStore())
    await act(() => result.current.loadHosts())
    expect(result.current.groups).toContain('all')
    expect(result.current.groups).toContain('work')
    expect(result.current.groups).not.toContain('myserver')
  })
})

describe('setGroup', () => {
  it('updates activeGroup', () => {
    const { result } = renderHook(() => useShellStore())
    act(() => result.current.setGroup('work'))
    expect(result.current.activeGroup).toBe('work')
  })
})

describe('form state', () => {
  it('openAddForm sets mode to add', () => {
    const { result } = renderHook(() => useShellStore())
    act(() => result.current.openAddForm())
    expect(result.current.form.mode).toBe('add')
    expect(result.current.form.hostId).toBeNull()
  })

  it('openEditForm sets mode to edit with hostId', () => {
    const { result } = renderHook(() => useShellStore())
    act(() => result.current.openEditForm('abc-123'))
    expect(result.current.form.mode).toBe('edit')
    expect(result.current.form.hostId).toBe('abc-123')
  })

  it('closeForm resets form state', () => {
    const { result } = renderHook(() => useShellStore())
    act(() => result.current.openAddForm())
    act(() => result.current.closeForm())
    expect(result.current.form.mode).toBeNull()
  })
})

describe('addHost', () => {
  it('calls add IPC, rebuild, then reloads hosts', async () => {
    mockBridge.add.mockResolvedValue(undefined)
    mockBridge.rebuild.mockResolvedValue(undefined)
    mockBridge.list.mockResolvedValue(['myhost'])
    mockBridge.get.mockResolvedValue('# id: new-id\nHost myhost\n  Hostname 1.2.3.4\n')
    const { result } = renderHook(() => useShellStore())
    await act(() => result.current.addHost({ alias: 'myhost', hostname: '1.2.3.4', user: 'deploy' }))
    expect(mockBridge.add).toHaveBeenCalled()
    expect(mockBridge.rebuild).toHaveBeenCalled()
    expect(result.current.hosts).toHaveLength(1)
  })
})

describe('removeHost', () => {
  it('calls remove IPC, rebuild, then reloads hosts', async () => {
    mockBridge.remove.mockResolvedValue(undefined)
    mockBridge.rebuild.mockResolvedValue(undefined)
    mockBridge.list.mockResolvedValue([])
    const { result } = renderHook(() => useShellStore())
    await act(() => result.current.removeHost('myhost'))
    expect(mockBridge.remove).toHaveBeenCalledWith('myhost')
    expect(mockBridge.rebuild).toHaveBeenCalled()
  })
})
