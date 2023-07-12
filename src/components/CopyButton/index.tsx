import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { canCopyToClipboard, copyToClipboard } from '@play/util'
import { IconButton } from '../IconButton'

interface CopyButtonProps {
  value: string
  message?: string
}

export function CopyButton({ value, message }: CopyButtonProps) {
  const copy = useCallback(async () => {
    await copyToClipboard(value || '')
    toast.info(message || 'Copied to clipboard!')
  }, [message, value])

  if (canCopyToClipboard()) return <IconButton onClick={copy} icon="copy" />

  return <></>
}
