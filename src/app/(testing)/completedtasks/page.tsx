'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getCompletedTodos } from '../../_actions'
import dayjs from 'dayjs'

const AllCompletedTasks = () => {
  const [completedTodos, setCompletedTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchCompletedTodos = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (!session?.user) {
          throw new Error('Unauthorized: User not logged in')
        }

        const completedTodos: any = await getCompletedTodos(session.user._id)
        console.log(completedTodos)
        setCompletedTodos(completedTodos)
      } catch (error: any) {
        console.error('Error fetching completed todos:', error)
        setError(error.toString())
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompletedTodos()
  }, [session])

  if (isLoading) {
    return <p className='pt-2'>Loading completed tasks...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  if (completedTodos.length === 0) {
    return <p>You dont have any completed tasks yet.</p>
  }

  return (
    <div className='p-2 h-full '>
      <h2><b>Completed Tasks</b></h2>
      <ul className='list list-disc pl-6'>
        {' '}
        {/* Tailwind classes for style */}
        {completedTodos.map((todo: any) => (
          <li key={todo._id} className='list-item'>
            {todo.title} {' '}
            <span>
              task completed on{' '}
              {dayjs(todo.plannedDateOfCompletion).format('DD/MM/YYYY')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AllCompletedTasks
