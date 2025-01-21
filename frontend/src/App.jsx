import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage' 

import { Routes,Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp'
import LogIn from './pages/LogIn'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import useAuthStore from './store/authStore.js'
import useThemeStore from './store/themeStore.js'
import { Loader} from 'lucide-react'
import { Toaster } from 'react-hot-toast'

const  App = () => {
  const { authUser, isCheckingAuth,checkAuth,onlineUsers } = useAuthStore()
  const {theme}=useThemeStore()
  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='animate-spin size-10' />
      </div>
    )
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={authUser ? <HomePage /> : <Navigate to={'/login'} />}
        />
        <Route
          path='/signup'
          element={!authUser ? <SignUp /> : <Navigate to={'/'} />}
        />
        <Route
          path='/login'
          element={!authUser ? <LogIn /> : <Navigate to={'/'} />}
        />
        <Route
          path='/profile'
          element={authUser ? <Profile /> : <Navigate to={'/login'} />}
        />
        <Route path='/settings' element={<Settings />} />
      </Routes>
      <Toaster/>
    </div>
  )
}
export default App
