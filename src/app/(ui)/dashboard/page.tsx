'use client'
import { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import TodoCard from '../todoCard'
import { useDragControls } from 'framer-motion'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import AllCompletedTasks from '@/app/(testing)/completedtasks/page'
import{motion} from 'framer-motion'


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
    <section className='container mx-auto w-full'>
      <div className='fixed left-0 top-0 z-50 w-full  bg-white shadow-md'>
        <Navbar />
      </div>
      <div className='grid md:grid-cols-[85%_15%] mt-12 grid-cols-1 relative h-full items-start' >
        <div className='mt-12'>
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
                    <motion.div key={data._id} className='m-4'
                       whileHover={{ scale: 1.05,opacity: 1 }}
                      >
                      <TodoCard
                        userid={sessionuser}
                        id={data._id}
                        title={data.title}
                        description={data.todos}
                        startdate={data.startDate}
                        enddate={data.plannedDateOfCompletion}
                      />
                    </motion.div>
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
        <div className='mt-12 pt-2 capitalize sticky top-20'>
          <AllCompletedTasks/>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
