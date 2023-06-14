import { create } from 'zustand'
import { nanoid } from 'nanoid'
import environment from '@play/environment'

type SendMessageDto = {
  recipient: string
  content: string
}

type ReceiveMessageDto = {
  sender: string
  content: string
}

type Message = {
  sender: string
  content: string
}

interface ChatStore {
  clientId: string
  messages: { [sender: string]: Message[] }
  connection?: WebSocket
  connect: () => void
  sendMessage: (message: SendMessageDto) => void
  receiveMessage: (message: ReceiveMessageDto) => void
}

export const useChatStore = create<ChatStore>()((set, get) => ({
  clientId: nanoid(),
  messages: {},
  connect: async () => {
    const connection = new WebSocket(
      `${environment.wsUrl}/chat/${get().clientId}`
    )

    connection.onmessage = (evt) => {
      const message: ReceiveMessageDto = JSON.parse(evt.data)

      get().receiveMessage(message)
    }

    set({ connection })
  },
  sendMessage: (message: SendMessageDto) => {
    get().connection?.send(JSON.stringify(message))
    const messages = get().messages

    const msg = { sender: get().clientId, content: message.content }

    if (messages[message.recipient]) {
      messages[message.recipient].push(msg)
    } else {
      messages[message.recipient] = [msg]
    }
  },
  receiveMessage: (message: ReceiveMessageDto) => {
    const messages = get().messages

    if (messages[message.sender]) {
      messages[message.sender].push(message)
    } else {
      messages[message.sender] = [message]
    }

    set({ messages: { ...messages } })
  }
}))
