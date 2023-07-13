import { pick } from 'lodash'
import { useCallback, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { shallow } from 'zustand/shallow'
import useSwr from 'swr'
import { ContainerContext } from '@play/context'
import { isAxiosError, AxiosError } from 'axios'
import { toast } from 'react-toastify'

export type RestoreMatchForm = {
  pmp: string
  name: string
}

export function useMatch() {
  const container = useContext(ContainerContext)

  const { code = '' } = useParams()

  const useMatchRootStore = container.resolve('useMatchRootStore')
  const {
    game,
    pmp = '',
    join,
    fetchByCode
  } = useMatchRootStore(
    (state) => pick(state, 'game', 'pmp', 'join', 'fetchByCode'),
    shallow
  )

  const { error, isLoading } = useSwr('/fetchMatchByCode', () =>
    fetchByCode(code)
  )

  const onRestoreMatch = useCallback(
    async (data: RestoreMatchForm) => {
      try {
        await join(code, {
          name: data.name,
          state: {},
          pmp: data.pmp
        })
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.code === AxiosError.ERR_BAD_REQUEST) {
            toast.error('Invalid name or pmp')
          }
        }
      }
    },
    [code, join]
  )

  return { game, pmp, error, isLoading, code, onRestoreMatch }
}
