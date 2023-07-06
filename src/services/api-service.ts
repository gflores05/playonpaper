import { Dependencies } from '@play/container'

export interface IApiService<
  GetDto extends { id: GetDto['id'] },
  CreateRequest,
  UpdateRequest
> {
  get: (id: GetDto['id']) => Promise<GetDto>
  getAll: (params?: Record<string, any>) => Promise<GetDto[]>
  create: (postDto: CreateRequest) => Promise<GetDto>
  update: (id: GetDto['id'], patchDto: UpdateRequest) => Promise<GetDto>
}

export type ApiServiceFactory = <
  GetDto extends { id: GetDto['id'] },
  CreateRequest,
  UpdateRequest
>(
  resource: string
) => IApiService<GetDto, CreateRequest, UpdateRequest>

export function createApiServiceFactory({
  apiClient
}: Dependencies): ApiServiceFactory {
  return <GetDto extends { id: GetDto['id'] }, PostDto, PatchDto>(
    resource: string
  ) => {
    async function getAll<GetDto>(params?: Record<string, any>) {
      const query = params ? new URLSearchParams(params).toString() : ''

      const response = await apiClient.get<GetDto[]>(`${resource}/?${query}`)

      return response.data
    }

    async function get(id: GetDto['id']) {
      const response = await apiClient.get<GetDto>(`/${resource}/${id}`)

      return response.data
    }

    async function create(data: PostDto) {
      const response = await apiClient.post<GetDto>(resource, data)

      return response.data
    }

    async function update(id: GetDto['id'], data: PatchDto) {
      const response = await apiClient.patch<GetDto>(`/${resource}/${id}`, data)

      return response.data
    }

    return {
      getAll,
      get,
      create,
      update
    }
  }
}
