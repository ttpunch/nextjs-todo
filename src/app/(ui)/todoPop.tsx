
import { Button } from '@/components/ui/button';
import TodoForm from './todoAddForm';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

const TodoPop = () => {
  return (
    <div className='w-full stroke-white rounded-full'>
    <Dialog>
      <DialogTrigger asChild>
        <Button  className="rounded-full" variant="secondary">Add Todo</Button>
      </DialogTrigger>
      <DialogContent>
      <TodoForm/>
      </DialogContent>
    </Dialog>
  </div>
  )
}

export default TodoPop