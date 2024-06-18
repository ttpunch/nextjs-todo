import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

const CompletedTaskCarousel = ({ data }: any) => {
  console.log(data)
  return (
    <Carousel className="w-full h-full flex flex-col justify-center">
      <CarouselContent >
        {data.map((todo:any)=> (
          <CarouselItem key={todo.id}>
            <Card className='max-w-max overflow-hidden  rounded-lg bg-white shadow-lg md:w-auto md:scale-100 scale-90 '>
            <CardHeader>
              <CardTitle>Title: {""}{todo.title}</CardTitle>
              <CardContent className='text-wrap'>Description:{""}{todo.todos}</CardContent>
              <CardContent>Completion Date:{""}{new Date(todo.plannedDateOfCompletion).toLocaleDateString()}</CardContent>
            </CardHeader>
            </Card>
          </CarouselItem>
         
        ))}
      </CarouselContent>
      <CarouselNext />
      <CarouselPrevious />
    </Carousel>
  )
}

export default CompletedTaskCarousel
