import { create } from 'zustand'
import type { SshHost } from '@/lib/types'
import { parse, serialize } from '@/lib/parser'

type FormState = { mode: 'add' | 'edit' | null; hostId: string | null }
type IpcError = { code: string; message: string }

type ShellStore = {
  hosts: SshHost[]
  activeGroup: string
  groups: string[]
  form: FormState
  lastError: IpcError | null
  loadHosts(): Promise<void>
  addHost(data: Omit<SshHost, 'id'>): Promise<void>
  editHost(data: SshHost): Promise<void>
  removeHost(alias: string): Promise<void>
  setGroup(group: string): void
  openAddForm(): void
  openEditForm(hostId: string): void
  closeForm(): void
  clearError(): void
}

function deriveGroups(hosts: SshHost[]): string[] {
  const suffixes = hosts
    .filter(h => h.alias.includes('.'))
    .map(h => h.alias.split('.').pop()!)
  return ['all', ...Array.from(new Set(suffixes))]
}

async function loadAll(): Promise<SshHost[]> {
  const aliases = await window.sshconfig.list()
  return Promise.all(
    aliases.map(async alias => {
      const content = await window.sshconfig.get(alias)
      return parse(alias, content)
    })
  )
}

export const useShellStore = create<ShellStore>((set) => ({
  hosts: [],
  activeGroup: 'all',
  groups: ['all'],
  form: { mode: null, hostId: null },
  lastError: null,

  loadHosts: async () => {
    try {
      const hosts = await loadAll()
      set({ hosts, groups: deriveGroups(hosts) })
      if (hosts.length === 0) set(s => ({ form: { ...s.form, mode: 'add' } }))
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string }
      if (err.code === 'ENOT_INITIALIZED') {
        await window.sshconfig.init()
        const hosts = await loadAll()
        set({ hosts, groups: deriveGroups(hosts), form: hosts.length === 0 ? { mode: 'add', hostId: null } : { mode: null, hostId: null } })
      } else {
        set({ lastError: { code: err.code ?? 'UNKNOWN', message: err.message ?? String(e) } })
      }
    }
  },

  addHost: async (data) => {
    try {
      const id = crypto.randomUUID()
      const host: SshHost = { ...data, id }
      await window.sshconfig.add(host.alias, serialize(host))
      await window.sshconfig.rebuild()
      const hosts = await loadAll()
      set({ hosts, groups: deriveGroups(hosts), form: { mode: null, hostId: null } })
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string }
      set({ lastError: { code: err.code ?? 'UNKNOWN', message: err.message ?? String(e) } })
    }
  },

  editHost: async (data) => {
    try {
      await window.sshconfig.update(data.alias, serialize(data))
      await window.sshconfig.rebuild()
      const hosts = await loadAll()
      set({ hosts, groups: deriveGroups(hosts), form: { mode: null, hostId: null } })
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string }
      set({ lastError: { code: err.code ?? 'UNKNOWN', message: err.message ?? String(e) } })
    }
  },

  removeHost: async (alias) => {
    try {
      await window.sshconfig.remove(alias)
      await window.sshconfig.rebuild()
      const hosts = await loadAll()
      set({ hosts, groups: deriveGroups(hosts) })
      if (hosts.length === 0) set({ form: { mode: 'add', hostId: null } })
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string }
      set({ lastError: { code: err.code ?? 'UNKNOWN', message: err.message ?? String(e) } })
    }
  },

  setGroup: (group) => set({ activeGroup: group }),
  openAddForm: () => set({ form: { mode: 'add', hostId: null } }),
  openEditForm: (hostId) => set({ form: { mode: 'edit', hostId } }),
  closeForm: () => set({ form: { mode: null, hostId: null } }),
  clearError: () => set({ lastError: null }),
}))
