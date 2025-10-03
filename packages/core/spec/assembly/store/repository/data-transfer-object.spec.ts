import { describe, it, expect } from 'vitest'
import { storedAssemblyDtoScheme } from '#core/assembly/store/repository/data-transfer-object'

describe('StoredAssemblyDto スキーマ', () => {
  describe('storedAssemblyDtoScheme', () => {
    const baseDto = {
      id: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
      name: 'Test Assembly',
      description: 'Test description',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    }

    it('v1形式のassemblyフィールドを受け入れる', () => {
      const dto = {
        ...baseDto,
        assembly: 'h=0&c=1&a=2&l=3&b=0&f=0&g=0&e=0&rau=0&lau=0&rbu=0&lbu=0',
      }

      const result = storedAssemblyDtoScheme.safeParse(dto)

      expect(result.success).toBe(true)
    })

    it('v2形式のassemblyフィールドを受け入れる', () => {
      const dto = {
        ...baseDto,
        assembly:
          'v=2&h=HD001&c=CR001&a=AR001&l=LG001&b=BS001&f=FCS001&g=GN001&e=EXP001&rau=AU001&lau=AU001&rbu=BU001&lbu=BU001',
      }

      const result = storedAssemblyDtoScheme.safeParse(dto)

      expect(result.success).toBe(true)
    })

    it('assemblyフィールドが空文字列の場合は拒否', () => {
      const dto = {
        ...baseDto,
        assembly: '',
      }

      const result = storedAssemblyDtoScheme.safeParse(dto)

      expect(result.success).toBe(false)
    })

    it('assemblyフィールドが不正な形式の場合は拒否', () => {
      const dto = {
        ...baseDto,
        assembly: 'invalid format',
      }

      const result = storedAssemblyDtoScheme.safeParse(dto)

      expect(result.success).toBe(false)
    })
  })
})
