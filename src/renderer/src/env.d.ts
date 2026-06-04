/// <reference types="vite/client" />

interface Window {
  sshconfig: {
    init(): Promise<void>
    list(): Promise<string[]>
    get(alias: string): Promise<string>
    add(alias: string, content: string): Promise<void>
    update(alias: string, content: string): Promise<void>
    remove(alias: string): Promise<void>
    rebuild(): Promise<void>
    pickKeyFile(): Promise<string | null>
  }
}
