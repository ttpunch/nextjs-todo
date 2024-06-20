'use client'
import { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import TodoCard from '../todoCard'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import AllCompletedTasks from '@/app/(testing)/completedtasks/page'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { getAllSavedTasks, saveCompletedTasks } from '@/app/_actions'
import { useToast } from '@/components/ui/use-toast'
import CompletedTaskCarousel from '../completedTaskCarusal'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

const Dashboard = () => {
  const { data: session } = useSession()
  const [todos, setTodos] = useState([])
  const [savedcompletedTasks, setsavedCompletedTasks] = useState([])
  const [loading, setLoading] = useState(false) // Initial state should be false to not show loading initially
  const [sessionuser, setSessionUser] = useState('')
  const { toast } = useToast()

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

  const showSaveAllCompleteTask = async () => {
    try {
      const data: any = await getAllSavedTasks(session?.user._id)
      console.log(data)
      setsavedCompletedTasks(data)
    } catch (error) {
      console.log(error)
    }
  }
  const handleSaveAllCompleteTask = async () => {
    const response = await saveCompletedTasks(session?.user._id)
    if (response) {
      toast({
        title: 'Task Saved',
        description: 'Completed Task Saved Successfully',
        variant: 'default'
      })
    }
  }
  return (
    <section className='container relative mx-auto h-screen w-full scrollbar scrollbar-track-sky-300 scrollbar-thumb-sky-700'>
      <nav className='fixed left-0 top-0 z-50 w-full  bg-white shadow-md'>
        <Navbar />
      </nav>
      <div className='relative mt-12 grid h-screen grid-cols-1 items-start md:grid-cols-[85%_15%]'>
        <div className='mt-12'>
          {/* Adjust padding to prevent content overlap */}
          {session?.user?._id ? (
            loading ? (
              <div className='flex h-screen  items-center justify-center'>
                <Loader2 className='h-10 w-10 animate-spin' />
                <h1 className='ml-4 text-black'>Loading...</h1>
              </div>
            ) : (
              <div className='flex flex-wrap justify-start '>
                {todos.length > 0 ? (
                  todos.map((data: any) => (
                    <motion.div
                      key={data._id}
                      className='m-4'
                      whileHover={{ scale: 1.05, opacity: 1 }}
                    >
                      <TodoCard
                        userid={sessionuser}
                        id={data._id}
                        title={data.title}
                        description={data.todos}
                        startdate={data.startDate}
                        enddate={data.plannedDateOfCompletion}
                        backgroundColor={data.backgroundColor}
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
        <div className='sticky top-20 flex flex-col space-y-4 md:justify-between'>
          <div className='max-h-xl sticky top-20 mt-10 overflow-y-auto pt-2 capitalize'>
            {!loading && session ? <AllCompletedTasks /> : null}
          </div>
          <div className='flex justify-center'>
            <Dialog>
              <DialogTrigger asChild>
                {todos.length > 0 && (
                  <Button onClick={showSaveAllCompleteTask}>
                    All Completed Tasks
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent className='flex max-w-lg justify-center p-1'>
                <CompletedTaskCarousel data={savedcompletedTasks} />
              </DialogContent>
            </Dialog>
          </div>
          <div className='flex justify-center'>
            {todos.length > 0 && !loading && (
              <Button onClick={handleSaveAllCompleteTask}>
                Save Completed Tasks
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
