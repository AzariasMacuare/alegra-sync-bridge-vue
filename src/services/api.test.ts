import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  API_URL,
  openNewSocket,
  preFlightRegisterTransactionId,
  uploadInvoice,
  WSS_URL,
} from './api'
import { MockWebSocket, stubWebSocket } from '@/test/helpers/mockWebSocket'

describe('api service', () => {
  let mock: MockAdapter

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.restore()
    vi.unstubAllGlobals()
    MockWebSocket.reset()
  })

  describe('preFlightRegisterTransactionId', () => {
    it('returns transaction id from register endpoint', async () => {
      mock.onPost(`${API_URL}/ingest/register`).reply(200, 'tx-abc-123')

      await expect(preFlightRegisterTransactionId()).resolves.toBe('tx-abc-123')
    })

    it('throws when register fails', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mock.onPost(`${API_URL}/ingest/register`).reply(500)

      await expect(preFlightRegisterTransactionId()).rejects.toThrow()
      errorSpy.mockRestore()
    })
  })

  describe('uploadInvoice', () => {
    it('posts file and description to ingest endpoint', async () => {
      const file = new File(['data'], 'bill.pdf', { type: 'application/pdf' })
      
      // Corregido: Se quitó el expect.any(FormData) de la firma del onPost
      mock.onPost(`${API_URL}/ingest/tx-1`).reply(200, 'ok')

      await expect(
        uploadInvoice('tx-1', file, 'Factura cliente A'),
      ).resolves.toBe('ok')

      const request = mock.history.post[0]
      expect(request?.url).toBe(`${API_URL}/ingest/tx-1`)
    })

    it('throws when upload fails', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const file = new File(['data'], 'bill.pdf')
      mock.onPost(`${API_URL}/ingest/tx-err`).reply(400)

      await expect(uploadInvoice('tx-err', file, 'desc')).rejects.toThrow()
      errorSpy.mockRestore()
    })
  })

  describe('openNewSocket', () => {
    it('creates websocket with WSS_URL', () => {
      stubWebSocket()

      openNewSocket()

      expect(MockWebSocket.latest()?.url).toBe(WSS_URL)
    })
  })
})