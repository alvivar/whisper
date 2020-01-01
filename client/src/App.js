import React, { useState, useEffect } from 'react'
import logo from './logo.svg'

import './App.css'
import './styles/index.css'
import './styles/tailwind.css'

import useDebounce from './hooks/useDebounce'

const BlogName = ({ name }) => {
  return <InputField defaultValue={name}></InputField>
}

const InputField = ({ defaultValue, defaultSetValue }) => {
  const inputBgOk = 'bg-blue-100 focus:bg-blue-200'
  const inputBgEditing = 'bg-green-100 focus:bg-green-200'
  const inputBgError = 'bg-red-300 focus:bg-red-400'
  const [inputBg, setInputBg] = useState(inputBgOk)

  const [value, setValue] = useState(defaultValue)
  const debouncedValue = useDebounce(value, 1000)

  useEffect(() => {
    console.log('InputField modified')
    if (debouncedValue && debouncedValue !== defaultValue) {
      if (defaultSetValue) defaultSetValue(debouncedValue)
      console.log(`InputField saved: ${debouncedValue}`)
    }
  }, [debouncedValue])

  return (
    <div>
      <input
        className={`float-right w-full p-1 my-2 text-gray-600 focus:text-gray-800 ${inputBg} border-transparent outline-none rounded-lg`}
        onChange={e => {
          setValue(e.target.value)
          setInputBg(inputBgEditing)
        }}
        value={value}
      />
    </div>
  )
}

function App () {
  const [blogName, setBlogName] = useState('Blog Name')

  return (
    <div>
      <InputField
        defaultValue={blogName}
        defaultSetValue={setBlogName}
      ></InputField>
    </div>
  )
}

export default App
