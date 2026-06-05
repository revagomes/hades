export type SshHost = {
  id: string            // uuid stored as `# id: <uuid>` comment in alias file
  alias: string         // config.d filename AND Host directive value (always equal in v1)
  hostname?: string     // Hostname directive
  user?: string         // User directive
  port?: number         // Port directive (omitted when 22)
  identityFile?: string // IdentityFile directive
  extraLines?: string   // Raw passthrough for unrecognised directives
}

export type IpcResult<T> =
  | { data: T; error?: never }
  | { data?: never; error: { code: string; message: string } }
