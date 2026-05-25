import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ResultTable from './ResultTable.vue'
import { formatCurrency } from '@/lib/formatCurrency'
import { saleFixture } from '@/test/helpers/fixtures'

describe('ResultTable', () => {
  it('renders sale data fields', () => {
    const wrapper = mount(ResultTable, {
      props: { data: saleFixture },
    })

    expect(wrapper.text()).toContain(saleFixture.billId)
    expect(wrapper.text()).toContain(saleFixture.location)
    expect(wrapper.text()).toContain(saleFixture.category)
    expect(wrapper.text()).toContain(saleFixture.country)
    expect(wrapper.text()).toContain(
      formatCurrency(saleFixture.price, saleFixture.currency),
    )
  })

  it('shows success heading', () => {
    const wrapper = mount(ResultTable, {
      props: { data: saleFixture },
    })

    expect(wrapper.text()).toContain('Sincronización Exitosa')
  })
})
