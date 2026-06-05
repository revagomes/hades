import { useState } from 'react'
import { KeyFilePicker } from './KeyFilePicker'
import type { SshHost } from '@/lib/types'

type Props = {
  mode: 'add' | 'edit'
  host: SshHost | null
  onSave: (data: Omit<SshHost, 'id'> | SshHost) => void
  onCancel: () => void
}

export function HostForm({ mode, host, onSave, onCancel }: Props) {
  const [alias, setAlias] = useState(host?.alias ?? '')
  const [hostname, setHostname] = useState(host?.hostname ?? '')
  const [user, setUser] = useState(host?.user ?? '')
  const [port, setPort] = useState(host?.port ? String(host.port) : '')
  const [identityFile, setIdentityFile] = useState(host?.identityFile ?? '')
  const [aliasError, setAliasError] = useState('')

  function handleSave() {
    if (!alias.trim()) { setAliasError('Alias is required'); return }
    setAliasError('')
    const data = {
      ...(host ? { id: host.id, extraLines: host.extraLines } : {}),
      alias: alias.trim(),
      hostname: hostname.trim() || undefined,
      user: user.trim() || undefined,
      port: port ? parseInt(port, 10) : undefined,
      identityFile: identityFile.trim() || undefined,
    }
    onSave(data as SshHost)
  }

  return (
    <div className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold">{mode === 'add' ? 'Add Alias' : 'Edit Alias'}</h2>
        <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 uppercase">Alias</span>
        <input
          type="text"
          value={alias}
          onChange={e => setAlias(e.target.value)}
          placeholder="alias (e.g. myserver)"
          disabled={mode === 'edit'}
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-transparent disabled:opacity-50"
        />
        {aliasError && <span className="text-xs text-red-500">{aliasError}</span>}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 uppercase">Hostname</span>
        <input
          type="text"
          value={hostname}
          onChange={e => setHostname(e.target.value)}
          placeholder="hostname (e.g. 1.2.3.4)"
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 uppercase">User</span>
        <input
          type="text"
          value={user}
          onChange={e => setUser(e.target.value)}
          placeholder="user"
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-transparent"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 uppercase">Port</span>
        <input
          type="number"
          value={port}
          onChange={e => setPort(e.target.value)}
          placeholder="22"
          className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-transparent w-24"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 uppercase">Identity File</span>
        <KeyFilePicker value={identityFile} onChange={setIdentityFile} />
      </label>

      <div className="mt-auto pt-4">
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  )
}
