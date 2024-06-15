'use client'
import { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import TodoCard from '../todoCard'
import { useDragControls } from 'framer-motion'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import AllCompletedTasks from '@/app/(testing)/completedtasks/page'


const Dashboard = () => {
  const { data: session } = useSession()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false) // Initial state should be false to not show loading initially
  const [viewform, setViewForm] = useState(true)
  const controls = useDragControls()
  const [sessionuser, setSessionUser] = useState('')

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true) // Set loading to true before fetching data
        const response = await axios.post('/api/usertodos', {
          userId: session?.user?._id
        })
        setTodos(response.data.todos)
      } catch (error) {
        console.error('Error fetching todos:', error)
        // Set error state for proper error handling
      } finally {
        setLoading(false) // Ensure loading is set to false after fetching data
      }
    }

    if (session?.user?._id) {
      console.log(session.user._id)
      setSessionUser(session.user._id)
      fetchTodos()
    }
  }, [session])

  const handleForm = () => {
    setViewForm(false)
  }

  return (
    <section className='container mx-auto h-screen w-full '>
      <div className='fixed left-0 top-0 z-50 w-full bg-white shadow-md'>
        <Navbar />
      </div>
      <div className='grid md:grid-cols-[85%_15%] mt-16 h-screen grid-cols-1' >
        <div className='mt-16'>
           {/* Adjust padding to prevent content overlap */}
          {session?.user?._id ? (
            loading ? (
              <div className='flex h-full items-center justify-center'>
                <Loader2 className='h-10 w-10 animate-spin' />
                <h1 className='ml-4 text-black'>Loading....</h1>
              </div>
            ) : (
              <div className='flex flex-wrap justify-start '>
                {todos.length > 0 ? (
                  todos.map((data: any) => (
                    <div key={data._id} className='m-4' >
                      <TodoCard
                        userid={sessionuser}
                        id={data._id}
                        title={data.title}
                        description={data.todos}
                        startdate={data.startDate}
                        enddate={data.plannedDateOfCompletion}
                      />
                    </div>
                  ))
                ) : (
                  <p className='text-center text-gray-500'>
                    No todos available
                  </p>
                )}
              </div>
            )
          ) : (
            <div className='flex h-full items-center justify-center pt-16'>
              <h1 className='ml-4 text-black'>
                Please log in to see your todos
              </h1>
            </div>
          )}
        </div>
        <div className='mt-16 pt-2'>
          <AllCompletedTasks/>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
