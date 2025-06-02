import Login from "./components/pages/login"
import Dashborad from "./components/pages/dashboard"
import Layout from "./components/layout/Layout"
import Home from "./components/pages/home"
import Analysis from "./components/pages/analysis"
import Survey from "./components/pages/survey"
import ManageService from "./components/pages/manageService"
import ManageQuestion from "./components/pages/manageQuestion"
import Help from "./components/pages/help"
import FormSurvey from "./components/pages/formSurvey"
import ManageFormSurvey from "./components/pages/manageFormSurvey"
import Profile from "./components/pages/profile"
import Notification from "./components/pages/notification"
import ForgetPassword from "./components/pages/forgetPassword"
import { createBrowserRouter, RouterProvider } from 'react-router'


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
      path: '/lupa-password',
      element: <ForgetPassword></ForgetPassword>
    },
    {
      path: '/surveiBNN',
      element: <FormSurvey></FormSurvey>
    },
    {
      path: '/surveiBNN/kelola',
      element: <ManageFormSurvey></ManageFormSurvey>
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
        {
          path: '/profil',
          element: <Profile></Profile>
        },
        {
          path: '/notifikasi',
          element: <Notification></Notification>
        },
      ]
    }
  ])

  return (
    <>
      <div className='min-h-screen'>
        <RouterProvider router={router}></RouterProvider>
      </div>
    </>
  )
}

export default App
