import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useShellStore } from '@/store/useShellStore'

const ERROR_MESSAGES: Record<string, string> = {
  ENOT_INITIALIZED: 'SSH config directory not found — reinitializing.',
  EALIAS_EXISTS: 'An alias with that name already exists.',
  EALIAS_NOT_FOUND: 'Alias not found — it may have been deleted externally.',
  EINVALID_ALIAS: 'Invalid alias name. Avoid slashes, spaces, and leading dots.',
  EEMPTY_CONTENT: 'Alias content cannot be empty.',
}

export function ErrorToast() {
  const lastError = useShellStore(s => s.lastError)
  const clearError = useShellStore(s => s.clearError)

  useEffect(() => {
    if (!lastError) return
    const timer = setTimeout(clearError, 5000)
    return () => clearTimeout(timer)
  }, [lastError, clearError])

  if (!lastError) return null

  const message = ERROR_MESSAGES[lastError.code] ?? `Something went wrong: ${lastError.message}`

  return (
    <div className="fixed bottom-4 right-4 flex items-start gap-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-300 rounded-lg px-4 py-3 shadow-lg max-w-xs text-sm">
      <span className="flex-1">{message}</span>
      <button onClick={clearError} className="text-red-400 hover:text-red-600">
        <X size={14} />
      </button>
    </div>
  )
}
