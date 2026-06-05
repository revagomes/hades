import { Pencil, Trash2 } from 'lucide-react'
import type { SshHost } from '@/lib/types'

type Props = {
  hosts: SshHost[]
  onEdit: (id: string) => void
  onRemove: (alias: string) => void
}

export function HostList({ hosts, onEdit, onRemove }: Props) {
  if (hosts.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No aliases yet. Click <span className="mx-1 font-semibold">+ Add</span> to create one.
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-500 uppercase border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="text-left px-4 py-2">Alias</th>
            <th className="text-left px-4 py-2">Hostname</th>
            <th className="text-left px-4 py-2">User</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {hosts.map(host => (
            <tr
              key={host.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <td className="px-4 py-2 font-mono">{host.alias}</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{host.hostname ?? '—'}</td>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-400">{host.user ?? '—'}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2 justify-end">
                  <button
                    title="Edit"
                    onClick={() => onEdit(host.id)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    title="Remove"
                    onClick={() => onRemove(host.alias)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
