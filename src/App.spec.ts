import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.vue'
import * as api from '@/services/api'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { saleFixture, createFile } from '@/test/helpers/fixtures'
import { mountWithPinia } from '@/test/helpers/mountWithPinia'
import {
  MockWebSocket,
  expectSocketRegistered,
  stubWebSocket,
} from '@/test/helpers/mockWebSocket'

vi.mock('@/services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof api>()
  return {
    ...actual,
    preFlightRegisterTransactionId: vi.fn(),
    uploadInvoice: vi.fn(),
    openNewSocket: vi.fn(),
  }
})

const UploaderStub = {
  name: 'Uploader',
  template:
    '<button class="trigger-upload" @click="$emit(\'onUploaded\', { file, description: \'test\' })" />',
  props: ['file'],
  setup() {
    return { file: createFile() }
  },
}

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    stubWebSocket()
    vi.mocked(api.openNewSocket).mockImplementation(() => {
      const socket = new MockWebSocket(api.WSS_URL)
      queueMicrotask(() => socket.simulateOpen())
      return socket as unknown as WebSocket
    })
    vi.mocked(api.preFlightRegisterTransactionId).mockResolvedValue('tx-test-1')
    vi.mocked(api.uploadInvoice).mockResolvedValue('uploaded')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    MockWebSocket.reset()
  })

  it('shows uploader initially', () => {
    const wrapper = mountWithPinia(App, {
      global: { stubs: { Uploader: UploaderStub, FluidCursor: true } },
    })

    expect(wrapper.find('.trigger-upload').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ResultTable' }).exists()).toBe(false)
  })

  it('runs full sync flow and shows result after step 6', async () => {
    const wrapper = mountWithPinia(App, {
      global: {
        stubs: {
          Uploader: UploaderStub,
          FluidCursor: true,
          Notification: true,
        },
      },
    })
    const store = useNotificationStore()

    await wrapper.get('.trigger-upload').trigger('click')
    await flushPromises()

    expect(api.preFlightRegisterTransactionId).toHaveBeenCalled()
    expect(api.uploadInvoice).toHaveBeenCalledWith(
      'tx-test-1',
      expect.any(File),
      'test',
    )
    expect(store.activeNotifications.length).toBeGreaterThanOrEqual(1)
    expectSocketRegistered('tx-test-1')

    const socket = MockWebSocket.latest()!
    socket.simulateMessage({ step: 1 })
    socket.simulateMessage({ step: 2 })
    expect(store.activeNotifications.length).toBeGreaterThanOrEqual(3)

    socket.simulateMessage({ step: 6, aditional: saleFixture })
    await vi.advanceTimersByTimeAsync(5000)
    await flushPromises()

    expect(socket.close).toHaveBeenCalled()
    expect(wrapper.findComponent({ name: 'ResultTable' }).exists()).toBe(true)
    expect(wrapper.text()).toContain(saleFixture.billId)
  })
})
