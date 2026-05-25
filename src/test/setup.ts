import { config } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { afterEach, vi } from 'vitest'

const MotionStub = defineComponent({
  name: 'Motion',
  inheritAttrs: false,
  setup(_, { slots, attrs }) {
    return () => h('div', attrs, slots.default?.())
  },
})

const ClientOnlyStub = defineComponent({
  name: 'ClientOnly',
  setup(_, { slots }) {
    return () => slots.default?.()
  },
})

config.global.stubs = {
  Motion: MotionStub,
  ClientOnly: ClientOnlyStub,
  Teleport: true,
  FluidCursor: true,
  AnimatedList: {
    template: '<div class="animated-list-stub"><slot /></div>',
  },
}

config.global.components = {
  ClientOnly: ClientOnlyStub,
}

afterEach(() => {
  vi.clearAllMocks()
  vi.useRealTimers()
})
