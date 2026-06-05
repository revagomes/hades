import { describe, it, expect, vi, beforeEach } from 'vitest'
import { makeHandlers } from '../src/main/handlers'

const mockLib = {
  init: vi.fn(),
  list: vi.fn(),
  get: vi.fn(),
  add: vi.fn(),
  edit: vi.fn(),
  remove: vi.fn(),
  update: vi.fn(),
}

const handlers = makeHandlers(mockLib as any)

beforeEach(() => { vi.clearAllMocks() })

describe('handleList', () => {
  it('returns data on success', async () => {
    mockLib.list.mockReturnValue(['alpha', 'beta'])
    const result = await handlers.handleList()
    expect(result).toEqual({ data: ['alpha', 'beta'] })
  })

  it('returns error on SshConfigError', async () => {
    const err = Object.assign(new Error('not initialized'), { code: 'ENOT_INITIALIZED' })
    mockLib.list.mockImplementation(() => { throw err })
    const result = await handlers.handleList()
    expect(result).toEqual({ error: { code: 'ENOT_INITIALIZED', message: 'not initialized' } })
  })
})

describe('handleGet', () => {
  it('returns file content', async () => {
    mockLib.get.mockReturnValue('Host alpha\n')
    const result = await handlers.handleGet('alpha')
    expect(result).toEqual({ data: 'Host alpha\n' })
    expect(mockLib.get).toHaveBeenCalledWith('alpha', undefined)
  })
})

describe('handleAdd', () => {
  it('calls add and returns empty data', async () => {
    mockLib.add.mockReturnValue(undefined)
    const result = await handlers.handleAdd('myhost', 'Host myhost\n')
    expect(result).toEqual({ data: undefined })
    expect(mockLib.add).toHaveBeenCalledWith('myhost', 'Host myhost\n', undefined)
  })
})

describe('handleUpdate', () => {
  it('calls edit and returns empty data', async () => {
    mockLib.edit.mockReturnValue(undefined)
    const result = await handlers.handleUpdate('myhost', 'Host myhost\n  User new\n')
    expect(result).toEqual({ data: undefined })
    expect(mockLib.edit).toHaveBeenCalledWith('myhost', 'Host myhost\n  User new\n', undefined)
  })
})

describe('handleRemove', () => {
  it('calls remove and returns empty data', async () => {
    mockLib.remove.mockReturnValue(undefined)
    const result = await handlers.handleRemove('myhost')
    expect(result).toEqual({ data: undefined })
    expect(mockLib.remove).toHaveBeenCalledWith('myhost', undefined)
  })
})

describe('handleRebuild', () => {
  it('calls update', async () => {
    mockLib.update.mockReturnValue(undefined)
    const result = await handlers.handleRebuild()
    expect(result).toEqual({ data: undefined })
    expect(mockLib.update).toHaveBeenCalled()
  })
})

describe('handleInit', () => {
  it('calls init and returns empty data', async () => {
    mockLib.init.mockReturnValue(undefined)
    const result = await handlers.handleInit()
    expect(result).toEqual({ data: undefined })
    expect(mockLib.init).toHaveBeenCalled()
  })
})
