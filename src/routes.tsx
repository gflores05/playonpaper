import { createBrowserRouter } from 'react-router-dom'
import Root from './views/Root'
import { Games } from './views/Games'
import { Game } from './views/Game'
import ErrorPage from './views/ErrorPage'
import Chat from './views/Chat'

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
