import { create } from 'zustand'
import { IdentifiableMap } from './identifiable-map'
import { IApiService } from '@play/services'

export interface CRUDStore<T extends { id: T['id'] }, PostDto, PatchDto> {
  items: IdentifiableMap<T>
  current?: T
  select: (id: T['id']) => void
  fetch: () => Promise<void>
  fetchOne: (id: T['id']) => Promise<void>
  update: (id: T['id'], dto: PatchDto) => Promise<void>
  delete: (id: T['id']) => Promise<void>
  add: (dto: PostDto) => Promise<void>
  set: (item: Partial<T>) => void
  remove: (id: T['id']) => T | undefined
}

export function createBaseCRUDStore<
  T extends { id: T['id'] },
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
  apiService: IApiService<T, PostDto, PatchDto>
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
    fetch: async () => {
      const data = await apiService.getAll()

      set({ items: new IdentifiableMap(data) })
    },
    select: (id: T['id']) => set({ current: get().items.get(id) }),
    fetchOne: async (id: T['id']) => {
      const item = await apiService.get(id)

      const items = get().items.add(item)

      set({ items })
    },
    update: async (id: T['id'], dto: PatchDto) => {
      const item = await apiService.patch(id, dto)

      updateMap(item)
    },
    delete: async (id: T['id']) => {
      const items = get().items.remove(id)

      set({ items })
    },
    add: async (dto: PostDto) => {
      const item = await apiService.post(dto)

      updateMap(item)
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

export function createCRUDStore<T extends { id: T['id'] }, PostDto, PatchDto>(
  apiService: IApiService<T, PostDto, PatchDto>
) {
  return create<CRUDStore<T, PostDto, PatchDto>>()((set, get) =>
    createBaseCRUDStore(set, get, apiService)
  )
}
