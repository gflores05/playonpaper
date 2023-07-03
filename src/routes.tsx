import { createBrowserRouter } from 'react-router-dom'
import Root from '@play/views/Root'
import { Games } from '@play/games'
import ErrorPage from '@play/views/ErrorPage'
import Chat from '@play/views/Chat'
import { StartGame } from './games/StartGame'
import { Match } from './games/tictactoe/Match'

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
        path: 'games/new/:slug',
        element: <StartGame />
      },
      {
        path: 'tic-tac-toe/:code',
        element: <Match />
      },
      {
        path: 'chat',
        element: <Chat />
      }
    ]
  }
])

export default router
