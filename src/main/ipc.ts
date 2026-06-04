import { ipcMain, dialog } from 'electron'
import * as sshLib from 'sshconfig'
import { makeHandlers } from './handlers'

const h = makeHandlers(sshLib)

export function setupIpc(): void {
  ipcMain.handle('sshconfig:init', () => h.handleInit())
  ipcMain.handle('sshconfig:list', () => h.handleList())
  ipcMain.handle('sshconfig:get', (_e, alias: string) => h.handleGet(alias))
  ipcMain.handle('sshconfig:add', (_e, alias: string, content: string) => h.handleAdd(alias, content))
  ipcMain.handle('sshconfig:update', (_e, alias: string, content: string) => h.handleUpdate(alias, content))
  ipcMain.handle('sshconfig:remove', (_e, alias: string) => h.handleRemove(alias))
  ipcMain.handle('sshconfig:rebuild', () => h.handleRebuild())
  ipcMain.handle('sshconfig:pickKeyFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Select SSH Key File',
      defaultPath: `${process.env.HOME}/.ssh`,
      filters: [{ name: 'All Files', extensions: ['*'] }],
      properties: ['openFile'],
    })
    return canceled ? null : filePaths[0]
  })
}
