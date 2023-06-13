import { Link, Outlet } from 'react-router-dom'
import logo from '../../logo.svg'

export default function Root() {
  return (
    <div className="flex flex-col justify-center w-full bg-black mx-auto h-full">
      <div className="container mx-auto">
        <h1 className="text-3xl text-center font-bold text-white underline">
          Play on Paper
        </h1>
        <div className="max-w-md mx-auto">
          <img src={logo} alt="logo" />
        </div>
        <Link className="text-white text-2xl text-center" to="games">
          Games
        </Link>{' '}
        <Link className="text-white text-2xl text-center" to="chat">
          Chat
        </Link>
        <Outlet />
      </div>
    </div>
  )
}
