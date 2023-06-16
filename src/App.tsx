import { RouterProvider } from 'react-router-dom'
import router from '@play/routes'
import { container, ContainerContext } from '@play/context'

function App() {
  return (
    <ContainerContext.Provider value={container}>
      <RouterProvider router={router} />
    </ContainerContext.Provider>
  )
}

export default App
