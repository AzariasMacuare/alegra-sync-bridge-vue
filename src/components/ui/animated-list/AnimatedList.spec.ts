import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AnimatedList from './AnimatedList.vue'

const Item = defineComponent({
  props: { label: { type: String, required: true } },
  template: '<div class="item">{{ label }}</div>',
})

describe('AnimatedList', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not duplicate items when children grow rapidly', async () => {
    const labels = ['a', 'b', 'c', 'd', 'e', 'f']
    const wrapper = mount(AnimatedList, {
      props: { delay: 50, itemCount: labels.length },
      slots: {
        default: () => labels.map((label) => h(Item, { label })),
      },
    })

    await flushPromises()
    await vi.runAllTimersAsync()
    await flushPromises()

    const renderedLabels = wrapper.findAll('.item').map((n) => n.text())
    expect(renderedLabels).toHaveLength(labels.length)
    expect(new Set(renderedLabels).size).toBe(labels.length)
    expect(renderedLabels.sort()).toEqual([...labels].sort())
  })
})
