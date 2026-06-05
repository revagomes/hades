type Props = {
  groups: string[]
  activeGroup: string
  onSelect: (group: string) => void
}

export function GroupFilter({ groups, activeGroup, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-1 p-3 w-40 border-r border-gray-200 dark:border-gray-700 h-full">
      {groups.map(group => (
        <button
          key={group}
          onClick={() => onSelect(group)}
          className={`text-left px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            group === activeGroup
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          {group}
        </button>
      ))}
    </div>
  )
}
