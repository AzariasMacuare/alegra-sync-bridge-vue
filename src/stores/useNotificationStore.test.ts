import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useNotificationStore } from './useNotificationStore'

describe('useNotificationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with empty notifications', () => {
    const store = useNotificationStore()
    expect(store.activeNotifications).toEqual([])
  })

  it('adds notification from step template', () => {
    const store = useNotificationStore()
    store.addNotification(0)

    expect(store.activeNotifications).toHaveLength(1)
    expect(store.activeNotifications[0]).toMatchObject({
      name: '1/7 - Cliente: Archivo Seleccionado',
      icon: '📄',
      color: '#297d40',
    })
    expect(store.activeNotifications[0].id).toBeTypeOf('number')
    expect(store.activeNotifications[0].time).toBeTypeOf('string')
  })

  it('ignores duplicate step index in the same session', () => {
    const store = useNotificationStore()
    store.addNotification(2)
    store.addNotification(2)
    store.addNotification(3)

    expect(store.activeNotifications).toHaveLength(2)
    expect(store.activeNotifications[0].name).toContain('AWS SQS')
    expect(store.activeNotifications[1].name).toContain('AWS Lambda')
  })

  it('supports all pipeline steps 0-6', () => {
    const store = useNotificationStore()

    for (let step = 0; step <= 6; step++) {
      store.addNotification(step)
    }

    expect(store.activeNotifications).toHaveLength(7)
    expect(store.activeNotifications[6].name).toBe('7/7 - Result: Final Sync')
    expect(store.activeNotifications[6].icon).toBe('✅')
  })
})
