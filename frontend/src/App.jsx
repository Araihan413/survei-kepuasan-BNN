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
import NotAuthorized from "./components/pages/notAuthorized"
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./AuthContext"
import { PrivateRoute } from "./routes/PrivateRoute"
import { Navigate } from 'react-router-dom';


function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/login" replace />,
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
      path: "/unauthorized",
      element: <NotAuthorized />,
    },
    {
      // element: <PrivateRoute />,
      // children: [
      //   {
      path: '/survei/kelola',
      element: <ManageFormSurvey></ManageFormSurvey>
    },
    //   ]
    // },
    {
      // element: < PrivateRoute />,
      // children: [
      //   {
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
          element: <Notification allowedRoles={['admin super']}></Notification>
        },
        // {
        //   element: <PrivateRoute></PrivateRoute>,
        //   children: [
        //     {
        //       path: '/kelola-akun',
        //       element: <Profile></Profile>
        //     }
        //   ]
        // }
      ]
    }
    //   ]
    // },
  ])

  return (
    <>
      <AuthProvider>
        <div className='min-h-screen'>
          <RouterProvider router={router}></RouterProvider>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </AuthProvider>
    </>
  )
}

export default App
