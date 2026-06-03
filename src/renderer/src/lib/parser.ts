import type { SshHost } from './types'

const ID_COMMENT_RE = /^#\s*id:\s*(.+)$/
const DIRECTIVE_RE = /^(\S+)\s+(.+)$/

export function parse(alias: string, content: string): SshHost {
  const lines = content.split('\n')
  const host: Partial<SshHost> & { alias: string } = { alias }
  const extraLines: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const idMatch = trimmed.match(ID_COMMENT_RE)
    if (idMatch) { host.id = idMatch[1].trim(); continue }

    const dirMatch = trimmed.match(DIRECTIVE_RE)
    if (!dirMatch) { extraLines.push(line); continue }

    const [, key, value] = dirMatch
    switch (key.toLowerCase()) {
      case 'host': break
      case 'hostname': host.hostname = value; break
      case 'user': host.user = value; break
      case 'port': host.port = parseInt(value, 10); break
      case 'identityfile': host.identityFile = value; break
      default: extraLines.push(line)
    }
  }

  if (!host.id) host.id = crypto.randomUUID()
  if (extraLines.length) host.extraLines = extraLines.join('\n')

  return host as SshHost
}

export function serialize(host: SshHost): string {
  const lines: string[] = [
    `# id: ${host.id}`,
    `Host ${host.alias}`,
  ]
  if (host.hostname) lines.push(`  Hostname ${host.hostname}`)
  if (host.user) lines.push(`  User ${host.user}`)
  if (host.port && host.port !== 22) lines.push(`  Port ${host.port}`)
  if (host.identityFile) lines.push(`  IdentityFile ${host.identityFile}`)
  if (host.extraLines) lines.push(host.extraLines)
  return lines.join('\n') + '\n'
}
