import React, { useState, useEffect } from 'react'
import logo from './logo.svg'

import './App.css'
import './styles/index.css'
import './styles/tailwind.css'

import useDebounce from './hooks/useDebounce'

const InputField = ({ defaultValue, OnValueChange }) => {
  const [value, setValue] = useState(defaultValue)
  const debouncedValue = useDebounce(value, 1000)

  const bgOk = 'bg-blue-100 focus:bg-blue-200'
  const bgEditing = 'bg-green-100 focus:bg-green-200'
  const bgError = 'bg-red-300 focus:bg-red-400'
  const [bg, setBg] = useState(bgOk)

  useEffect(() => {
    console.log('InputField modified')
    if (debouncedValue) {
      OnValueChange(debouncedValue)
      setBg(bgOk)
      console.log(`InputField saved: ${debouncedValue}`)
    }
  }, [debouncedValue])

  return (
    <div>
      <input
        className={`w-full py-4 px-4 my-2 text-gray-600 focus:text-gray-800 ${bg} border-transparent outline-none rounded-lg`}
        onChange={e => {
          setValue(e.target.value)
          setBg(bgEditing)
        }}
        value={value}
      />
    </div>
  )
}

const TextArea = ({ defaultValue, OnValueChange }) => {
  const [value, setValue] = useState(defaultValue)
  const debouncedValue = useDebounce(value, 1000)

  const bgOk = 'bg-blue-100 focus:bg-blue-200'
  const bgEditing = 'bg-green-100 focus:bg-green-200'
  const bgError = 'bg-red-300 focus:bg-red-400'
  const [bg, setBg] = useState(bgOk)

  useEffect(() => {
    console.log('TextArea modified')
    if (debouncedValue) {
      OnValueChange(debouncedValue)
      setBg(bgOk)
      console.log(`TextArea saved: ${debouncedValue}`)
    }
  }, [debouncedValue])

  return (
    <textarea
      className={`w-full h-64 py-4 px-4 text-gray-800 ${bg} border-transparent outline-none rounded-lg`}
      onChange={e => {
        setValue(e.target.value)
        setBg(bgEditing)
      }}
      value={value}
    />
  )
}

function App () {
  const [blogName, setBlogName] = useState('Blog Name')
  const [postContent, setPostContent] = useState('Post content')

  return (
    <div className='container mx-auto max-w-xl'>
      <InputField
        defaultValue={blogName}
        OnValueChange={setBlogName}
      ></InputField>
      <TextArea
        defaultValue={postContent}
        OnValueChange={setPostContent}
      ></TextArea>
    </div>
  )
}

export default App
