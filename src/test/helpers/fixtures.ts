import type { SaleData } from '@/components/ResultTable.vue'

export const saleFixture: SaleData = {
  country: 'Colombia',
  price: 150000,
  currency: 'COP',
  location: 'Cafe Central',
  category: 'Alimentos',
  billId: 'uuid-test-123',
}

export function createFile(name = 'invoice.pdf', type = 'application/pdf') {
  return new File(['test content'], name, { type, lastModified: Date.now() })
}
