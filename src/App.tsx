import { useContext, useEffect } from 'react'
import './App.css'
import useRouteElements from './useRouteElements'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from './contexts/app.context'
import { LocalStorageEventTarget } from './utils/auth'
function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])
  return (
    <>
      {routeElements}
      <ToastContainer />
    </>
  )
}

export default App
