import Login from "./components/pages/login"
import Dashborad from "./components/pages/dashboard"
import { createBrowserRouter, RouterProvider } from 'react-router'
import ProtectedRouter from "./routes/ProtectedRoute"
import { AuthProvider } from "./auth/AuthContext"
import Layout from "./components/layout/Layout"
import Home from "./components/pages/home"
function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home></Home>
    },
    {
      path: '/login',
      element: <Login></Login>
    },
    {
      path: '/',
      element: <Layout></Layout>,
      children: [
        {
          path: '/dashboard',
          element: <Dashborad></Dashborad>
        }
      ]
    }
  ])

  return (
    <>
      <div className='w-screen h-screen flex justify-center items-center bg-blue-100'>
        <RouterProvider router={router}></RouterProvider>
      </div>
    </>
  )
}

export default App
