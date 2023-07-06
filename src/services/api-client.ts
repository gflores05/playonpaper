import axios from 'axios'
import { Dependencies } from '@play/container'

export function createApiClient({ apiUrl }: Dependencies) {
  return axios.create({ baseURL: apiUrl })
}
