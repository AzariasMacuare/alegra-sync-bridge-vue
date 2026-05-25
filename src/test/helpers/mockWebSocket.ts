import { vi } from 'vitest'
import { WSS_URL } from '@/services/api'

export class MockWebSocket {
  static instances: MockWebSocket[] = []
  static OPEN = 1

  readyState = MockWebSocket.OPEN
  onopen: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  onclose: (() => void) | null = null
  sent: string[] = []
  close = vi.fn()

  url: string

  constructor(url: string) {
    this.url = url
    MockWebSocket.instances.push(this)
  }

  send(data: string) {
    this.sent.push(data)
  }

  simulateOpen() {
    this.onopen?.()
  }

  simulateMessage(payload: object) {
    this.onmessage?.({ data: JSON.stringify(payload) })
  }

  static reset() {
    MockWebSocket.instances = []
  }

  static latest() {
    return MockWebSocket.instances[MockWebSocket.instances.length - 1]
  }
}

export function stubWebSocket() {
  MockWebSocket.reset()
  vi.stubGlobal('WebSocket', MockWebSocket as unknown as typeof WebSocket)
  return MockWebSocket
}

export function expectSocketRegistered(transactionId: string) {
  const socket = MockWebSocket.latest()
  expect(socket?.url).toBe(WSS_URL)
  expect(socket?.sent).toContainEqual(
    JSON.stringify({ action: 'register', transactionId }),
  )
}
