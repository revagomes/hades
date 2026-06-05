import { contextBridge, ipcRenderer } from 'electron'
import type { IpcResult } from '../renderer/src/lib/types'

async function invoke<T>(channel: string, ...args: unknown[]): Promise<T> {
  const result: IpcResult<T> = await ipcRenderer.invoke(channel, ...args)
  if (result.error) {
    const err = Object.assign(new Error(result.error.message), { code: result.error.code })
    throw err
  }
  return result.data as T
}

contextBridge.exposeInMainWorld('sshconfig', {
  init: () => invoke<void>('sshconfig:init'),
  list: () => invoke<string[]>('sshconfig:list'),
  get: (alias: string) => invoke<string>('sshconfig:get', alias),
  add: (alias: string, content: string) => invoke<void>('sshconfig:add', alias, content),
  update: (alias: string, content: string) => invoke<void>('sshconfig:update', alias, content),
  remove: (alias: string) => invoke<void>('sshconfig:remove', alias),
  rebuild: () => invoke<void>('sshconfig:rebuild'),
  pickKeyFile: () => invoke<string | null>('sshconfig:pickKeyFile'),
})
