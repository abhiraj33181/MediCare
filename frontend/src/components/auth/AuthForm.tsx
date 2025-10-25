'use client'

import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { Checkbox } from '../ui/checkbox'
import Link from 'next/link'
import { Separator } from '../ui/separator'

interface AuthFormProps {
  type: 'login' | 'signup'
  userRole: 'patient' | 'doctor'
}

const AuthForm = ({ type, userRole }: AuthFormProps) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const { registerDoctor, registerPatient, loginDoctor, loginPatient, loading, error } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (type === 'signup' && !agreeTerms) return

    try {
      if (type === 'signup') {
        const registerFn = userRole === 'doctor' ? registerDoctor : registerPatient
        await registerFn(formData)
        router.push(`/onboarding/${userRole}`)
      } else {
        const loginFn = userRole === 'doctor' ? loginDoctor : loginPatient
        await loginFn(formData.email, formData.password)
        if (userRole === 'doctor') router.push('/doctor/dashboard')
      }
    } catch (err) {
      console.error(`${type} failed:`, err)
    }
  }

  const handleGoogleAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?type=${userRole}`
  }

  const isSignUp = type === 'signup'
  const title = isSignUp ? 'Create a Secure Account' : 'Welcome Back!'
  const buttonText = isSignUp ? 'Create Account' : 'Sign In'
  const altTextLink = isSignUp ? 'Already a member? ' : "Don’t have an account? "
  const altLinkAction = isSignUp ? 'Sign In' : 'Sign Up'
  const altLinkPath = isSignUp ? `/login/${userRole}` : `/signup/${userRole}`

  return (
    <div className='w-full max-w-md mx-auto py-10'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-extrabold text-blue-700 tracking-tight'>MedyGo+</h1>
      </div>

      <Card className='border-0 shadow-2xl rounded-2xl'>
        <CardContent className='p-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-6 text-center'>{title}</h2>

          {error && (
            <div className='mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            {isSignUp && (
              <div className='space-y-2'>
                <label htmlFor='name' className='font-medium text-gray-700'>
                  Full Name
                </label>
                <Input
                  id='name'
                  type='text'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className='border-gray-300 rounded-lg focus-visible:ring-blue-500 focus-visible:ring-2'
                  required
                />
              </div>
            )}

            <div className='space-y-2'>
              <label htmlFor='email' className='font-medium text-gray-700'>
                Email Address
              </label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className='border-gray-300 rounded-lg focus-visible:ring-blue-500 focus-visible:ring-2'
                required
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='password' className='font-medium text-gray-700'>
                Password
              </label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className='border-gray-300 rounded-lg pr-10 focus-visible:ring-blue-500 focus-visible:ring-2'
                  required
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4 text-gray-500' />
                  ) : (
                    <Eye className='h-4 w-4 text-gray-500' />
                  )}
                </Button>
              </div>
            </div>

            {isSignUp && (
              <div className='flex items-start space-x-2 pt-2'>
                <Checkbox
                  id='terms'
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                />
                <label htmlFor='terms' className='text-sm text-gray-600 leading-5'>
                  I am over 18 years old and agree to{' '}
                  <Link href='#' className='text-blue-600 hover:underline'>
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link href='#' className='text-blue-600 hover:underline'>
                    Privacy Policy
                  </Link>
                </label>
              </div>
            )}

            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 rounded-full py-3 text-white font-semibold'
              disabled={loading || (isSignUp && !agreeTerms)}
            >
              {loading ? `${isSignUp ? 'Creating' : 'Signing'}...` : buttonText}
            </Button>
          </form>

          <div className='mt-8 relative flex items-center justify-center'>
            <Separator />
            <span className='absolute bg-white px-3 text-gray-500 text-sm'>OR</span>
          </div>

          <div className='mt-8'>
            <Button
              type='button'
              variant='outline'
              className='w-full rounded-full border-gray-300 hover:bg-gray-50 flex items-center justify-center'
              onClick={handleGoogleAuth}
            >
              <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                <path
                  fill='#4285F4'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='#34A853'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='#FBBC05'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='#EA4335'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              {isSignUp ? 'Sign up' : 'Sign in'} with Google
            </Button>
          </div>

          <div className='mt-6 text-center'>
            <span className='text-gray-600'>{altTextLink}</span>
            <Link href={altLinkPath} className='text-blue-600 hover:underline font-medium'>
              {altLinkAction}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthForm
