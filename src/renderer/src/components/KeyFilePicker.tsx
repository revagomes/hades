import { FolderOpen } from 'lucide-react'

type Props = {
  value: string
  onChange: (path: string) => void
}

export function KeyFilePicker({ value, onChange }: Props) {
  async function pick() {
    const path = await window.sshconfig.pickKeyFile()
    if (path) onChange(path)
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="~/.ssh/id_ed25519"
        className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-transparent"
      />
      <button
        type="button"
        onClick={pick}
        title="Browse"
        className="px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <FolderOpen size={14} />
      </button>
    </div>
  )
}
