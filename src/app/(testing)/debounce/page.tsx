'use client'
import { useState } from 'react'

import { useDebounceCallback } from 'usehooks-ts'

export default function Component() {
  const [value, setValue] = useState('')

  const debounced = useDebounceCallback(setValue, 1000)

  return (
    <div>
      <p>Debounced value: {value}</p>

      <input
        className='ring bg-slate-500'
        type='text'
        defaultValue={value}
        onChange={event => debounced(event.target.value)}
      />
    </div>
  )
}
