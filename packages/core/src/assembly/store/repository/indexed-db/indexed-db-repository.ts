import { createAssembly } from '#core/assembly/assembly'
import { assemblyToSearchV2 } from '#core/assembly/serialize/as-query-v2'
import { deserializeAssembly } from '#core/assembly/serialize/deserialize-assembly'
import {
  type StoredAssemblyDto,
  storedAssemblyDtoScheme,
} from '#core/assembly/store/repository/data-transfer-object'
import {
  type DataBase,
  setupDataBase,
} from '#core/assembly/store/repository/indexed-db/indexed-db'
import type {
  ClearableStoredAssemblyRepository,
  NewAssemblyAggregation,
  StoredAssemblyAggregation,
  StoredAssemblyRepository,
  UpdatedAssemblyAggregation,
} from '#core/assembly/store/stored-assembly'

import type { Candidates } from '@ac6_assemble_tool/parts/types/candidates'

export class IndexedDbRepository
  implements StoredAssemblyRepository, ClearableStoredAssemblyRepository
{
  private readonly database: DataBase

  /**
   * 直接の利用はテストからに限定すること
   */
  constructor(candidates: Candidates) {
    this.database = setupDataBase(candidates)
  }

  async storeNew(
    aggregation: NewAssemblyAggregation,
    candidates: Candidates,
    current: Date = new Date(),
  ): Promise<void> {
    const { data, error } = aggregationToDto({
      ...aggregation,
      createdAt: current,
      updatedAt: current,
    })
    if (error) {
      return Promise.reject(error)
    }

    await this.database.stored_assembly.add(data)
  }

  async all(candidates: Candidates): Promise<StoredAssemblyAggregation[]> {
    return this.database.stored_assembly.toArray().then((xs) =>
      xs
        .map((x) => {
          const { data, error } = dtoToAggregation(x, candidates)

          if (data) {
            return data
          } else {
            throw new Error(`invalid data exist: ${error}`)
          }
        })
        .toSorted((a, b) => (a.id <= b.id ? -1 : 1)),
    )
  }

  async findById(
    id: string,
    candidates: Candidates,
  ): Promise<StoredAssemblyAggregation | null> {
    return this.database.stored_assembly.get(id).then((result) => {
      if (!result) {
        return null
      }

      const { data, error } = dtoToAggregation(result, candidates)

      if (data) {
        return data
      } else {
        throw new Error(`${id} is invalid data: ${error}`)
      }
    })
  }

  async delete(aggregation: StoredAssemblyAggregation): Promise<void> {
    await this.database.stored_assembly.delete(aggregation.id)
  }

  async update(
    aggregation: UpdatedAssemblyAggregation,
    candidates: Candidates,
    current: Date = new Date(),
  ): Promise<void> {
    const { data, error } = aggregationToDto({
      ...aggregation,
      updatedAt: current,
    })
    if (error) {
      return Promise.reject(error)
    }

    await this.database.stored_assembly.put(data)
  }
  async insert(
    aggregation: StoredAssemblyAggregation,
  ): Promise<void> {
    const { data, error } = aggregationToDto(aggregation)
    if (error) {
      return Promise.reject(error)
    }

    await this.database.stored_assembly.add(data)
  }

  async clear(): Promise<void> {
    await this.database.stored_assembly.clear()
  }
}

type TransformResult<T> =
  | { data: T; error: null }
  | { data: null; error: Error }
function aggregationToDto(
  aggregation: StoredAssemblyAggregation,
): TransformResult<StoredAssemblyDto> {
  const dto = {
    id: aggregation.id,
    name: aggregation.name,
    description: aggregation.description,
    assembly: assemblyToSearchV2(aggregation.assembly).toString(),
    createdAt: aggregation.createdAt,
    updatedAt: aggregation.updatedAt,
  }

  const result = storedAssemblyDtoScheme.safeParse(dto)

  return result.success
    ? { data: dto, error: null }
    : { data: null, error: result.error }
}

function dtoToAggregation(
  dto: StoredAssemblyDto,
  candidates: Candidates,
): TransformResult<StoredAssemblyAggregation> {
  const result = storedAssemblyDtoScheme.safeParse(dto)

  return result.success
    ? {
        data: {
          ...result.data,
          assembly: createAssembly(
            deserializeAssembly(
              new URLSearchParams(result.data.assembly),
              candidates,
            ),
          ),
        },
        error: null,
      }
    : { data: null, error: result.error }
}
