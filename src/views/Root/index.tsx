import { Link, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export default function Root() {
  return (
    <div className="flex flex-col pt-24 w-full mx-auto h-full">
      <ToastContainer />
      <div className="container mx-auto">
        <h1 className="text-3xl text-center font-bold underline">
          Play on Paper
        </h1>
        <Link className="text-2xl text-center" to="games">
          Games
        </Link>{' '}
        <Link className="text-2xl text-center" to="chat">
          Chat
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
