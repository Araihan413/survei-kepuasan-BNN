import Login from "./components/pages/login"
import Dashborad from "./components/pages/dashboard"
import Layout from "./components/layout/Layout"
import Home from "./components/pages/home"
import Analysis from "./components/pages/analysis"
import Survey from "./components/pages/survey"
import ManageService from "./components/pages/manageService"
import ManageQuestion from "./components/pages/manageQuestion"
import Help from "./components/pages/help"
import { createBrowserRouter, RouterProvider } from 'react-router'
import ProtectedRouter from "./routes/ProtectedRoute"
import { AuthProvider } from "./auth/AuthContext"
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
        },
        {
          path: '/analisis',
          element: <Analysis></Analysis>
        },
        {
          path: '/survei',
          element: <Survey></Survey>
        },
        {
          path: '/kelola-pertanyaan',
          element: <ManageQuestion></ManageQuestion>
        },
        {
          path: '/kelola-layanan',
          element: <ManageService></ManageService>
        },
        {
          path: '/bantuan',
          element: <Help></Help>
        },
      ]
    }
  ])

  return (
    <>
      <div className='w-screen h-screen'>
        <RouterProvider router={router}></RouterProvider>
      </div>
    </>
  )
}

export default App
