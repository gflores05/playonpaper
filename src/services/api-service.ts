import axios from 'axios'

type APIOptions = {
  baseUrl: string
  resource: string
}

export interface IApiService<
  GetDto extends { id: GetDto['id'] },
  PostDto,
  PatchDto
> {
  get: (id: GetDto['id']) => Promise<GetDto>
  getAll: (params?: Record<string, any>) => Promise<GetDto[]>
  post: (postDto: PostDto) => Promise<GetDto>
  patch: (id: GetDto['id'], patchDto: PatchDto) => Promise<GetDto>
}

export function createBaseApiService<
  GetDto extends { id: GetDto['id'] },
  PostDto,
  PatchDto
>(opts: APIOptions): IApiService<GetDto, PostDto, PatchDto> {
  const apiClient = axios.create({ baseURL: opts.baseUrl })

  async function getAll(params?: Record<string, any>) {
    const query = params ? new URLSearchParams(params).toString() : ''

    const response = await apiClient.get<GetDto[]>(`${opts.resource}/?${query}`)

    return response.data
  }

  async function get(id: GetDto['id']) {
    const response = await apiClient.get<GetDto>(`/${opts.resource}/${id}`)

    return response.data
  }

  async function post(data: PostDto) {
    const response = await apiClient.post<GetDto>(opts.resource, data)

    return response.data
  }

  async function patch(id: GetDto['id'], data: PatchDto) {
    const response = await apiClient.patch<GetDto>(
      `/${opts.resource}/${id}`,
      data
    )

    return response.data
  }

  return {
    getAll,
    get,
    post,
    patch
  }
}
