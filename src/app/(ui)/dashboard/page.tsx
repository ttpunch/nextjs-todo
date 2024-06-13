'use client'
import { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import TodoCard from '../todoCard'
import { useDragControls } from 'framer-motion'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

const Dashboard = () => {
  const { data: session } = useSession()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)  // Initial state should be false to not show loading initially
  const [viewform, setViewForm] = useState(true)
  const controls = useDragControls()
  const [sessionuser,setSessionUser]=useState("")

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true)  // Set loading to true before fetching data
        const response = await axios.post(
          '/api/usertodos',
          { userId: session?.user?._id }
        )
        setTodos(response.data.todos)
      } catch (error) {
        console.error('Error fetching todos:', error)
        // Set error state for proper error handling
      } finally {
        setLoading(false)  // Ensure loading is set to false after fetching data
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
      <div className='fixed top-0 left-0 w-full z-50 bg-white shadow-md'>
        <Navbar />
      </div>
      <div className='pt-16 h-full'>  {/* Adjust padding to prevent content overlap */}
        {session?.user?._id ? (
          loading ? (
            <div className='flex justify-center items-center h-full'>
              <Loader2 className='h-10 w-10 animate-spin' />
              <h1 className='text-black ml-4'>Loading....</h1>
            </div>
          ) : (
            <div className='mt-10 flex flex-wrap justify-start gap-2'>
              {todos.length > 0 ? (
                todos.map((data: any) => (
                  <div key={data._id}>
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
                <p className='text-center text-gray-500'>No todos available</p>
              )}
            </div>
          )
        ) : (
          <div className='flex justify-center items-center h-full pt-16'>
            <h1 className='text-black ml-4'>Please log in to see your todos</h1>
          </div>
        )}
      </div>
    </section>
  )
}

export default Dashboard
