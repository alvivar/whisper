import React, { useState, useEffect } from 'react'
import useDebounce from '../hooks/useDebounce'

const InputField = ({ defaultValue, OnValueChange }) => {
  const [value, setValue] = useState(defaultValue)
  const debouncedValue = useDebounce(value, 1000)

  const bgOk = 'bg-blue-100 focus:bg-blue-200'
  const bgEditing = 'bg-green-100 focus:bg-green-200'
  const bgError = 'bg-red-300 focus:bg-red-400'
  const [bg, setBg] = useState(bgOk)

  useEffect(() => {
    OnValueChange(debouncedValue)
    setBg(bgOk)
    console.log(`InputField saved: ${debouncedValue}`)
  }, [debouncedValue])

  return (
    <div>
      <input
        className={`float-left w-full py-4 px-4 my-2 text-gray-600 focus:text-gray-800 ${bg} border-transparent outline-none rounded-lg`}
        onChange={e => {
          setValue(e.target.value)
          setBg(bgEditing)
        }}
        value={value}
      />
    </div>
  )
}

export default InputField
