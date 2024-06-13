import React, { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { Switch } from '@/components/ui/switch'
import { sendReminderEmails } from '../_actions'
import { Loader2 } from 'lucide-react'

interface SwitchEmailReminderProps {
  userid: string
  email: string
}

const SwitchEmailReminder: React.FC<SwitchEmailReminderProps> = ({
  userid,
  email
}: any) => {
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [acceptEmail, setAcceptEmail] = useState(false) // Initial state for reminder setting
  const { toast } = useToast()

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post('/api/acceptEmailReminder', {
        userid,
        acceptEmail: !acceptEmail
      })

      if (response.data.success) {
        setAcceptEmail(!acceptEmail)
        toast({
          title: response.data.message,
          variant: 'default'
        })

        if (!acceptEmail) {
          // Send email only if reminder is turned on
          const emailResponse = await axios.post('/api/sendEmailReminders', {
            userId: userid
          })
          console.log(emailResponse.data)

          try {
            // Extract todos array from emailResponse
            const todos = emailResponse.data.todos
            // Use map to send reminder emails for each todo
            const emailPromises = todos.map(
              (todo: { title: string; plannedDateOfCompletion: Date }) =>
                sendReminderEmails({
                  email,
                  title: todo.title,
                  plannedDateOfCompletion: todo.plannedDateOfCompletion
                })
            )

            // Wait for all emails to be sent
            const emailsSent = await Promise.all(emailPromises)
            console.log(emailsSent)
            setIsSwitchLoading(false)
          } catch (error) {
            console.log(error)
          }
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update reminder settings',
        variant: 'destructive'
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }

  return (
    <div className='md:flex items-center justify-center hidden'>
      <Switch
        checked={acceptEmail}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
        className='ring-4 ring-white'
      />
      <div className='ml-2 flex'>
        Accept Reminders:{' '}
        <span>
        {isSwitchLoading ? (
          <Loader2 className='h-4 w-4 mt-[4px] animate-spin ' />
        ) : (
          <span>{acceptEmail ? 'On' : 'Off'}</span>
        )}
        </span>
      </div>
    </div>
  )
}

export default SwitchEmailReminder
