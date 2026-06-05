import type { IpcResult } from '../renderer/src/lib/types'

type SshLib = {
  init(opts?: unknown): void
  list(opts?: unknown): string[]
  get(alias: string, opts?: unknown): string
  add(alias: string, content: string, opts?: unknown): void
  edit(alias: string, content: string, opts?: unknown): void
  remove(alias: string, opts?: unknown): void
  update(opts?: unknown): void
}

function toIpcError(e: unknown): { code: string; message: string } {
  if (e && typeof e === 'object' && 'code' in e && 'message' in e) {
    return {
      code: (e as { code: string }).code,
      message: (e as { message: string }).message,
    }
  }
  return { code: 'UNKNOWN', message: String(e) }
}

function wrap<T>(fn: () => T): IpcResult<T> {
  try { return { data: fn() } }
  catch (e) { return { error: toIpcError(e) } }
}

export function makeHandlers(lib: SshLib) {
  return {
    handleInit: (): IpcResult<void> => wrap(() => lib.init()),
    handleList: (): IpcResult<string[]> => wrap(() => lib.list()),
    handleGet: (alias: string): IpcResult<string> => wrap(() => lib.get(alias, undefined)),
    handleAdd: (alias: string, content: string): IpcResult<void> => wrap(() => lib.add(alias, content, undefined)),
    handleUpdate: (alias: string, content: string): IpcResult<void> => wrap(() => lib.edit(alias, content, undefined)),
    handleRemove: (alias: string): IpcResult<void> => wrap(() => lib.remove(alias, undefined)),
    handleRebuild: (): IpcResult<void> => wrap(() => lib.update()),
  }
}
