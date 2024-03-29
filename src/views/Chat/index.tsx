import { useCallback, useContext, useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import pick from 'lodash/pick'
import { ContainerContext } from '@play/context'

export default function Chat() {
  const container = useContext(ContainerContext)
  const useChatStore = container.resolve('useChatStore')

  const { clientId, messages, connect, sendMessage } = useChatStore(
    (state) => pick(state, 'clientId', 'messages', 'connect', 'sendMessage'),
    shallow
  )
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')

  const onStartChat = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === 'Enter') {
        setRecipient(evt.currentTarget.value)
      }
    },
    [setRecipient]
  )

  const onSendMessage = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === 'Enter') {
        sendMessage({ content: message, recipient: recipient })
        setMessage('')
      }
    },
    [setMessage, sendMessage, message, recipient]
  )

  useEffect(() => {
    connect()
  }, [connect])

  return (
    <div className="container">
      <h2 className="text-2xl text-white">Your id is {clientId}</h2>
      <div>
        <label className="text-white">Chat with:</label>{' '}
        <input className="text-black" onKeyUp={onStartChat} />
      </div>
      {recipient && (
        <ul className="w-full max-h-60">
          {(messages[recipient] || []).map((message) => (
            <li
              className={
                message.sender === clientId ? 'bg-white' : 'bg-gray-600'
              }
            >
              {message.content}
            </li>
          ))}
        </ul>
      )}
      <div className="w-full">
        <input
          value={message}
          onChange={(evt) => setMessage(evt.currentTarget.value)}
          onKeyUp={onSendMessage}
        />
      </div>
    </div>
  )
}
