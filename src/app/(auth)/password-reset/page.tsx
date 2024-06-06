'use client'

import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { otpSchema } from '@/schemas/otpSchema'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { passwordresetSchema } from '@/schemas/passwordresetSchema'

export default function PasswordReset() {
  const [email, setEmail] = useState('')
  const [otpUi, setOtpUi] = useState(false)
  const [passwordUi, setPasswordUi] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const router = useRouter()
  const form = useForm<z.infer<typeof passwordresetSchema>>({
    resolver: zodResolver(passwordresetSchema),
    defaultValues: {
      email: '',
      otp: ''
    }
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const handleEmailCheck = async () => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/otpandemail', { email })
      toast({
        title: 'Success',
        description: response.data.message,
        duration: 5000
      })
      setOtpUi(true)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Error checking Email',
        duration: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailSubmit = async (event: any) => {
    event.preventDefault()
    await handleEmailCheck()
  }

  const handleOtpVerification = async (data: z.infer<typeof otpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/verifyotp', { email: data.email, otp: data.otp })
      toast({
        title: 'OTP Verified',
        description: response.data.message,
        duration: 5000
      })
      setPasswordUi(true)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'OTP Verification Failed',
        description: axiosError.response?.data.message ?? 'Error verifying OTP',
        duration: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpSubmit = async (event: any) => {
    event.preventDefault()
    const data = otpForm.getValues()
    console.log(data) // retrieve form values
    await handleOtpVerification({ ...data, email })
  }

  const handlePasswordReset = async (data: z.infer<typeof otpSchema>) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirm password do not match',
        duration: 5000
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/resetpassword', {
        email: data.email,
        newPassword: data.newPassword
      })
      toast({
        title: 'Success',
        description: response.data.message,
        duration: 5000
      })
      return response
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Password Reset Failed',
        description: axiosError.response?.data.message ?? 'Error resetting password',
        duration: 5000
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (event: any) => {
    event.preventDefault()
    const data = otpForm.getValues()
    console.log(data) // retrieve form values
    try {
      const response = await handlePasswordReset({ ...data,email })
      if (response && response.status === 200) {
        router.push("/sign-in")
      }
    } catch (error) {
      console.error('Password reset failed', error)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-800'>
      <div className='w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md'>
        <div className='text-center'>
          <h1 className='mb-6 text-xl font-extrabold tracking-tight lg:text-3xl'>
            Reset Password
          </h1>
          <p className='mb-4'>Enter Details</p>
        </div>
        <Form {...form}>
          <form onSubmit={handleEmailSubmit} className='space-y-6'>
            <FormField
              name='email'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    {...field}
                    name='email'
                    onChange={e => {
                      field.onChange(e)
                      setEmail(e.target.value)
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='w-full'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Please wait
                </>
              ) : (
                'Generate OTP'
              )}
            </Button>
          </form>
        </Form>
        {otpUi && (
          <Form {...otpForm}>
            <form onSubmit={handleOtpSubmit} className='space-y-6'>
              <FormField
                name='otp'
                control={otpForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <Input type='text' {...field} name='otp' />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please wait
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
            </form>
          </Form>
        )}
        {passwordUi && (
          <Form {...otpForm}>
            <form onSubmit={handlePasswordSubmit} className='space-y-6'>
              <FormField
                name='newPassword'
                control={otpForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <Input type='password' {...field} name='newPassword' />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='confirmPassword'
                control={otpForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input type='password' {...field} name='confirmPassword' />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please wait
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  )
}
