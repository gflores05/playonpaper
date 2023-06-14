import { createBrowserRouter } from 'react-router-dom'
import Root from '@play/views/Root'
import { Games } from '@play/views/Games'
import { Game } from '@play/views/Game'
import ErrorPage from '@play/views/ErrorPage'
import Chat from '@play/views/Chat'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'games',
        element: <Games />
      },
      {
        path: 'games/:gameId',
        element: <Game />
      },
      {
        path: 'chat',
        element: <Chat />
      }
    ]
  }
])

export default router
