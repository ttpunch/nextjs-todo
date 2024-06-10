'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { User } from 'next-auth'
import TodoPop from './todoPop'
import { PackageCheck } from 'lucide-react'
import SwitchEmailReminder from './emailReminderSwitch'

function Navbar() {
  const { data: session } = useSession()
  //console.log(session)
  const user: User = session?.user

  return (
    <nav className='bg-primary p-4 text-white shadow-lg md:p-6'>
      <div className='container mx-auto flex flex-col items-center justify-between md:flex-row'>
        <div className='flex items-center justify-center gap-x-2'>
          <PackageCheck className='scale-125' />
          <a href='#' className='mb-4 text-3xl font-bold md:mb-0'>
            Todo Planner
          </a>
        </div>
        <span className='relative'>
          <TodoPop />
        </span>

        {session ? (
          <SwitchEmailReminder
            userid={session.user._id}
            email={session.user.email}
          />
        ) : (
          <h1>No user</h1>
        )}

        <div>
          {session ? (
            <>
              <span className='mr-4  italic'>
                Welcome, {user.username || user.email}
              </span>
              <Button
                onClick={() => signOut()}
                className='w-full rounded-full bg-slate-100 text-black md:w-auto'
                variant='outline'
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href='/sign-in'>
              <Button
                className='w-full bg-slate-100 text-black md:w-auto'
                variant={'outline'}
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
