import React, { useState, useEffect } from 'react'
import useDebounce from '../hooks/useDebounce'

const TextArea = ({ defaultValue, OnValueChange }) => {
  const [value, setValue] = useState(defaultValue)
  const debouncedValue = useDebounce(value, 1000)

  const bgOk = 'bg-blue-200 focus:bg-blue-300 border-transparent'
  const bgEditing = 'bg-blue-200 focus:bg-blue-300 border border-gray-600'
  const bgError = 'bg-red-300 focus:bg-red-400 border-transparent'
  const [bg, setBg] = useState(bgOk)

  useEffect(() => {
    OnValueChange(debouncedValue)
    setBg(bgOk)
    console.log(`TextArea saved: ${debouncedValue}`)
  }, [debouncedValue])

  return (
    <textarea
      className={`float-left w-full h-32 py-4 px-4 text-gray-800 ${bg} outline-none rounded-lg`}
      onChange={e => {
        setValue(e.target.value)
        setBg(bgEditing)
      }}
      value={value}
    />
  )
}

export default TextArea
