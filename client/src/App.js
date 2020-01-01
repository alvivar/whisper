import React, { useState, useEffect } from 'react'
import logo from './logo.svg'

import './App.css'
import './styles/index.css'
import './styles/tailwind.css'

import useDebounce from './hooks/useDebounce'

const BlogName = ({ name }) => {
  return <InputField Value={name}></InputField>
}

const InputField = ({ defaultValue, SaveValue }) => {
  const inputBgOk = 'bg-blue-100 focus:bg-blue-200'
  const inputBgEditing = 'bg-green-100 focus:bg-green-200'
  const inputBgError = 'bg-red-300 focus:bg-red-400'
  const [inputBg, setInputBg] = useState(inputBgOk)

  const [value, setValue] = useState(defaultValue)
  const debouncedValue = useDebounce(value, 1000)

  useEffect(() => {
    console.log('InputField modified')
    if (debouncedValue) {
      SaveValue(debouncedValue)
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

const TextArea = ({ defaultValue, SaveValue }) => {
  const textAreaBgOk = 'bg-blue-100 focus:bg-blue-200'
  const textAreaBgError = 'bg-red-300 focus:bg-red-400'
  const [textAreaBg, setTextAreaBg] = useState(textAreaBgOk)

  const [value, setValue] = useState(defaultValue)
  const debouncedValue = useDebounce(value, 1000)

  useEffect(() => {
    console.log('TextArea modified')
    if (debouncedValue) {
      SaveValue(debouncedValue)
      console.log(`TextArea saved: ${debouncedValue}`)
    }
  }, [debouncedValue])

  return (
    <textarea
      className={`w-full h-32 py-4 px-4 text-gray-800 ${textAreaBg} border border-transparent outline-none rounded-lg`}
      onChange={e => setValue(e.target.value)}
      value={value}
    />
  )
}

function App () {
  const [blogName, setBlogName] = useState('Blog Name')
  const [postContent, setPostContent] = useState('Post content')

  return (
    <div>
      <InputField Value={blogName} SetValue={setBlogName}></InputField>
      <TextArea Value={postContent} SetValue={setPostContent}></TextArea>
    </div>
  )
}

export default App
