import { createContext } from 'react'
import { configureContainer } from '@play/container'

export const container = configureContainer()
export const ContainerContext = createContext(container)
