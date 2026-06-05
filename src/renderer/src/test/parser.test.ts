import { describe, it, expect } from 'vitest'
import { parse, serialize } from '@/lib/parser'

describe('parse', () => {
  it('extracts alias, hostname, user from config text', () => {
    const content = `# id: test-id-123\nHost myserver\n  Hostname 1.2.3.4\n  User deploy\n`
    const host = parse('myserver', content)
    expect(host.id).toBe('test-id-123')
    expect(host.alias).toBe('myserver')
    expect(host.hostname).toBe('1.2.3.4')
    expect(host.user).toBe('deploy')
  })

  it('extracts port and identityFile', () => {
    const content = `# id: abc\nHost srv\n  Port 2222\n  IdentityFile ~/.ssh/id_ed25519\n`
    const host = parse('srv', content)
    expect(host.port).toBe(2222)
    expect(host.identityFile).toBe('~/.ssh/id_ed25519')
  })

  it('preserves unknown directives in extraLines', () => {
    const content = `# id: abc\nHost srv\n  Hostname 1.2.3.4\n  ServerAliveInterval 60\n`
    const host = parse('srv', content)
    expect(host.extraLines).toContain('ServerAliveInterval 60')
  })

  it('generates a uuid id when none is present', () => {
    const content = `Host srv\n  Hostname 1.2.3.4\n`
    const host = parse('srv', content)
    expect(host.id).toMatch(/^[0-9a-f-]{36}$/)
  })

  it('skips the Host directive line itself — not in extraLines', () => {
    const content = `# id: abc\nHost myserver\n  Hostname 1.2.3.4\n`
    const host = parse('myserver', content)
    expect(host.extraLines).toBeUndefined()
  })
})

describe('serialize', () => {
  it('produces valid SSH config text with id comment and Host line', () => {
    const host = { id: 'abc', alias: 'myserver', hostname: '1.2.3.4', user: 'deploy' }
    const text = serialize(host)
    expect(text).toContain('# id: abc')
    expect(text).toContain('Host myserver')
    expect(text).toContain('Hostname 1.2.3.4')
    expect(text).toContain('User deploy')
  })

  it('omits port when undefined', () => {
    const host = { id: 'abc', alias: 'srv', hostname: '1.2.3.4' }
    expect(serialize(host)).not.toContain('Port')
  })

  it('includes port when set and not 22', () => {
    const host = { id: 'abc', alias: 'srv', hostname: '1.2.3.4', port: 2222 }
    expect(serialize(host)).toContain('Port 2222')
  })

  it('omits port when 22 (implicit default)', () => {
    const host = { id: 'abc', alias: 'srv', hostname: '1.2.3.4', port: 22 }
    expect(serialize(host)).not.toContain('Port')
  })

  it('round-trips a host with extraLines', () => {
    const content = `# id: abc\nHost srv\n  Hostname 1.2.3.4\n  ServerAliveInterval 60\n`
    const host = parse('srv', content)
    const out = serialize(host)
    expect(out).toContain('ServerAliveInterval 60')
  })

  it('ends with a newline', () => {
    const host = { id: 'abc', alias: 'srv' }
    expect(serialize(host).endsWith('\n')).toBe(true)
  })
})
