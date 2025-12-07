import {
  date,
  maxLength,
  minLength,
  object,
  pipe,
  readonly,
  regex,
  required,
  safeParse,
  string,
  ulid,
  type InferOutput,
} from 'valibot'

export const storedAssemblyDtoScheme = required(
  object({
    id: pipe(string(), ulid(), readonly()),
    name: pipe(string(), minLength(1), maxLength(30), readonly()),
    description: pipe(string(), minLength(0), maxLength(140), readonly()),
    assembly: pipe(
      string(),
      minLength(1),
      regex(/([a-z]+=[\dA-Z]+&?)+/),
      readonly(),
    ),
    createdAt: pipe(date(), readonly()),
    updatedAt: pipe(date(), readonly()),
  }),
)
export const parseStoredAssemblyDto = (input: unknown) =>
  safeParse(storedAssemblyDtoScheme, input)

export type StoredAssemblyDto = InferOutput<typeof storedAssemblyDtoScheme>
