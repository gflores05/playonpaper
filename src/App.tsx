import React from 'react'
import logo from './logo.svg'

function App() {
  return (
    <div className="flex flex-col justify-center w-full bg-black mx-auto h-full">
      <div className="container mx-auto">
        <h1 className="text-3xl text-center font-bold text-white underline">
          Play on Paper
        </h1>
        <div className="max-w-md mx-auto">
          <img src={logo} alt="logo" />
        </div>
      </div>
    </div>
  )
}

export default App
