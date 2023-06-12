import axios from 'axios'

type APIOptions = {
  baseUrl: string
  resource: string
}

export interface IApiService<T extends { id: T['id'] }, PostDto, PatchDto> {
  get: (id: T['id']) => Promise<T>
  getAll: () => Promise<T[]>
  post: (postDto: PostDto) => Promise<T>
  patch: (id: T['id'], patchDto: PatchDto) => Promise<T>
}

export function createBaseApiService<
  T extends { id: T['id'] },
  PostDto,
  PatchDto
>(opts: APIOptions): IApiService<T, PostDto, PatchDto> {
  const apiClient = axios.create({ baseURL: opts.baseUrl })

  async function getAll() {
    const response = await apiClient.get<T[]>(`${opts.resource}/`)

    return response.data
  }

  async function get(id: T['id']) {
    const response = await apiClient.get<T>(`/${opts.resource}/${id}`)

    return response.data
  }

  async function post(data: PostDto) {
    const response = await apiClient.post<T>(opts.resource, data)

    return response.data
  }

  async function patch(id: T['id'], data: PatchDto) {
    const response = await apiClient.patch<T>(`/${opts.resource}/${id}`, data)

    return response.data
  }

  return {
    getAll,
    get,
    post,
    patch
  }
}
