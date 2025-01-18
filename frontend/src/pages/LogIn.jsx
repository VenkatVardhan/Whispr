import React from 'react'
import useAuthStore from '../store/authStore'
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import AuthImagePattern from '../components/AuthImagePattern'
import toast from 'react-hot-toast'

const LogIn = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const { login, isLoggingIn } = useAuthStore()
  const validateForm = (formData) => {
    if (!formData.email.trim()) return toast.error('Email is Required')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      return toast.error('Invalid Email Format')
    }
    if (!formData.password.trim()) return toast.error('Password is  Required')
    return true
  }
  const handleSubmit = async (formData) => {
    const email = formData.get('email')
    const password = formData.get('password')

    const isValid = validateForm({email, password })
    if (isValid === true) {
      await login({email, password })
    }
  }
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/*logo*/}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group '>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors:'>
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
              <p className='text-base-content/60'>
                Sign in to your Account
              </p>
            </div>
          </div>
          {/* form */}
          <form action={handleSubmit} className='space-y-6'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Mail className='size-5 text-base-content/40' />
                </div>
                <input
                  type='email'
                  name='email'
                  className={`input input-bordered w-full pl-10`}
                  placeholder='you@example.com'
                  defaultValue={''}
                />
              </div>
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Lock className='size-5 text-base-content/40' />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input input-bordered w-full pl-10`}
                  defaultValue={''}
                  name='password'
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='size-5 text-base-content/40' />
                  ) : (
                    <Eye className='size-5 text-base-content/40' />
                  )}
                </button>
              </div>
            </div>

            <button
              type='submit'
              className='btn btn-primary w-full'
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <div className='text-center'>
            <p className='text-base-content/60'>
              Dont't have an account?{' '}
              <Link to='/signup' className='link link-primary'>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right */}
      <AuthImagePattern
        title='Welcome Back'
        subtitle='Sign in to continue conversations and catch up  with friends'
      />
    </div>
  )
}

export default LogIn
