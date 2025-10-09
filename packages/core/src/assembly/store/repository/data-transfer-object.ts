import { z } from 'zod'

export const storedAssemblyDtoScheme = z
  .object({
    id: z.string().ulid().readonly(),
    name: z.string().min(1).max(30).readonly(),
    description: z.string().min(0).max(140).readonly(),
    assembly: z
      .string()
      .min(1)
      .regex(/([a-z]+=[\dA-Z]+&?)+/)
      .readonly(),
    createdAt: z.date().readonly(),
    updatedAt: z.date().readonly(),
  })
  .required()
export type StoredAssemblyDto = z.infer<typeof storedAssemblyDtoScheme>
