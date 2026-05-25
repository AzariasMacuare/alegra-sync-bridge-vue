import { createPinia, setActivePinia } from 'pinia'
import { mount, type MountingOptions, type VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'

export function mountWithPinia(
  component: Component,
  options: MountingOptions = {},
): VueWrapper {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(component, {
    ...options,
    global: {
      plugins: [pinia],
      ...options.global,
    },
  })
}
