import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FileUpload from './FileUpload.vue'
import { createFile } from '@/test/helpers/fixtures'

describe('FileUpload', () => {
  it('emits onChange when file input changes', async () => {
    const wrapper = mount(FileUpload)
    const file = createFile('test.csv', 'text/csv')
    const input = wrapper.get('input[type="file"]')

    Object.defineProperty(input.element, 'files', {
      value: [file],
      configurable: true,
    })

    await input.trigger('change')

    const emitted = wrapper.emitted('onChange')
    expect(emitted).toHaveLength(1)
    expect(emitted?.[0]?.[0]).toEqual([file])
  })

  it('accumulates files on multiple selections', async () => {
    const wrapper = mount(FileUpload)
    const input = wrapper.get('input[type="file"]')
    const first = createFile('a.pdf')
    const second = createFile('b.pdf')

    Object.defineProperty(input.element, 'files', {
      value: [first],
      configurable: true,
    })
    await input.trigger('change')

    Object.defineProperty(input.element, 'files', {
      value: [second],
      configurable: true,
    })
    await input.trigger('change')

    const lastEmit = wrapper.emitted('onChange')?.at(-1)?.[0] as File[]
    expect(lastEmit).toHaveLength(2)
    expect(lastEmit.map((f) => f.name)).toEqual(['a.pdf', 'b.pdf'])
  })

  it('emits onChange on drop', async () => {
    const wrapper = mount(FileUpload)
    const file = createFile('dropped.json', 'application/json')
    const dropZone = wrapper.get('.group\\/file')

    const dataTransfer = {
      files: [file],
    }

    await dropZone.trigger('drop', { dataTransfer })

    const emitted = wrapper.emitted('onChange')
    expect(emitted?.[0]?.[0]).toEqual([file])
  })
})
