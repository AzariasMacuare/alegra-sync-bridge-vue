import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import Uploader from './Uploader.vue'
import { createFile } from '@/test/helpers/fixtures'

const FileUploadStub = defineComponent({
  name: 'FileUpload',
  emits: ['onChange'],
  setup(_, { emit, slots }) {
    return () =>
      h(
        'div',
        {
          class: 'file-upload-stub',
          onClick: () => emit('onChange', [createFile()]),
        },
        slots.default?.(),
      )
  },
})

const FileUploadGridStub = defineComponent({
  name: 'FileUploadGrid',
  template: '<div class="grid-stub" />',
})

const IInputStub = defineComponent({
  name: 'IInput',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template:
    '<input class="input-stub" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
})

describe('Uploader', () => {
  const global = {
    stubs: {
      FileUpload: FileUploadStub,
      FileUploadGrid: FileUploadGridStub,
      IInput: IInputStub,
    },
  }

  it('disables submit button without a file', () => {
    const wrapper = mount(Uploader, { global })
    const button = wrapper.get('button')

    expect(button.attributes('disabled')).toBeDefined()
  })

  it('enables submit after file selection', async () => {
    const wrapper = mount(Uploader, { global })

    await wrapper.get('.file-upload-stub').trigger('click')

    const button = wrapper.get('button')
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('emits onUploaded with file and description', async () => {
    const wrapper = mount(Uploader, { global })

    await wrapper.get('.input-stub').setValue('Factura Mayo')
    await wrapper.get('.file-upload-stub').trigger('click')
    await wrapper.get('button').trigger('click')

    const emitted = wrapper.emitted('onUploaded')
    expect(emitted).toHaveLength(1)
    expect(emitted?.[0]?.[0]).toMatchObject({
      description: 'Factura Mayo',
      file: expect.objectContaining({ name: 'invoice.pdf' }),
    })
  })

  it('does not emit when submit without file', async () => {
    const wrapper = mount(Uploader, { global })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('onUploaded')).toBeUndefined()
  })
})
