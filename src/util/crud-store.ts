import { create } from 'zustand'
import { IdentifiableMap } from './identifiable-map'
import { IApiService } from '@play/services'

export interface CRUDStore<T extends { id: T['id'] }, PostDto, PatchDto> {
  items: IdentifiableMap<T>
  current?: T
  select: (id: T['id']) => void
  fetch: (params?: Record<string, any>) => Promise<T[]>
  fetchOne: (id: T['id']) => Promise<void>
  update: (id: T['id'], dto: PatchDto) => Promise<void>
  delete: (id: T['id']) => Promise<void>
  add: (dto: PostDto) => Promise<void>
  set: (item: Partial<T>) => void
  remove: (id: T['id']) => T | undefined
}

export function createBaseCRUDStore<
  T extends { id: T['id'] },
  GetDto extends { id: GetDto['id'] },
  PostDto,
  PatchDto
>(
  set: (
    partial:
      | CRUDStore<T, PostDto, PatchDto>
      | Partial<CRUDStore<T, PostDto, PatchDto>>
      | ((
          state: CRUDStore<T, PostDto, PatchDto>
        ) =>
          | CRUDStore<T, PostDto, PatchDto>
          | Partial<CRUDStore<T, PostDto, PatchDto>>),
    replace?: boolean | undefined
  ) => void,
  get: () => CRUDStore<T, PostDto, PatchDto>,
  apiService: IApiService<GetDto, PostDto, PatchDto>,
  map: (dto: GetDto) => T
): CRUDStore<T, PostDto, PatchDto> {
  /**
   * Updated the collection and the selected item
   * @param item
   * @returns
   */
  function updateMap(item: Partial<T>) {
    const items = get().items.update(item)

    const current = get().current

    if (current && item.id === current.id) {
      return set({ items, current: { ...current, ...item } })
    }

    return set({ items })
  }

  return {
    items: new IdentifiableMap<T>([]),
    fetch: async (params?: Record<string, any>) => {
      const data = await apiService.getAll(params)
      const result = data.map(map)

      set({ items: new IdentifiableMap(result) })

      return result
    },
    select: (id: T['id']) => set({ current: get().items.get(id) }),
    fetchOne: async (id: T['id']) => {
      const item = await apiService.get(id)

      const items = get().items.add(map(item))

      set({ items })
    },
    update: async (id: T['id'], dto: PatchDto) => {
      const item = await apiService.update(id, dto)

      updateMap(map(item))
    },
    delete: async (id: T['id']) => {
      const items = get().items.remove(id)

      set({ items })
    },
    add: async (dto: PostDto) => {
      const item = await apiService.create(dto)

      updateMap(map(item))
    },
    set: updateMap,
    remove: (id: T['id']) => {
      const currentItems = get().items
      const item = currentItems.get(id)

      const items = currentItems.remove(id)

      const current = get().current

      if (current && id === current.id) {
        set({ items, current: undefined })
      } else {
        set({ items })
      }

      return item
    }
  }
}

export function createCRUDStore<
  T extends { id: T['id'] },
  GetDto extends { id: GetDto['id'] },
  PostDto,
  PatchDto
>(apiService: IApiService<GetDto, PostDto, PatchDto>, map: (dto: GetDto) => T) {
  return create<CRUDStore<T, PostDto, PatchDto>>()((set, get) =>
    createBaseCRUDStore(set, get, apiService, map)
  )
}
