import { useEffect } from 'react'
import { useShellStore } from '@/store/useShellStore'
import { GroupFilter } from '@/components/GroupFilter'
import { HostList } from '@/components/HostList'
import { HostForm } from '@/components/HostForm'
import { ErrorToast } from '@/components/ErrorToast'
import type { SshHost } from '@/lib/types'

export default function App() {
  const {
    hosts, groups, activeGroup, form,
    loadHosts, addHost, editHost, removeHost,
    setGroup, openAddForm, openEditForm, closeForm,
  } = useShellStore()

  useEffect(() => { loadHosts() }, [])

  const filteredHosts = activeGroup === 'all'
    ? hosts
    : hosts.filter(h => h.alias.split('.').pop() === activeGroup)

  const editingHost = form.hostId
    ? hosts.find(h => h.id === form.hostId) ?? null
    : null

  async function handleSave(data: Omit<SshHost, 'id'> | SshHost) {
    if (form.mode === 'add') await addHost(data as Omit<SshHost, 'id'>)
    else await editHost(data as SshHost)
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 select-none">
      {/* Titlebar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <span className="text-sm font-semibold">Hades</span>
        <button
          onClick={openAddForm}
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          className="text-xs bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700"
        >
          + Add
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <GroupFilter groups={groups} activeGroup={activeGroup} onSelect={setGroup} />

        {form.mode ? (
          <HostForm
            mode={form.mode}
            host={editingHost}
            onSave={handleSave}
            onCancel={closeForm}
          />
        ) : (
          <HostList
            hosts={filteredHosts}
            onEdit={openEditForm}
            onRemove={removeHost}
          />
        )}
      </div>

      <ErrorToast />
    </div>
  )
}
