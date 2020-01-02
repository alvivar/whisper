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

const PostButton = ({ enabled, OnClick }) => {
  return (
    <button
      onClick={e => {
        if (OnClick) OnClick()
      }}
      className={
        enabled
          ? 'float-right h-16 my-2 py-2 px-4 text-sm text-gray-500 hover:text-white bg-blue-100 hover:bg-blue-400 outline-none border-transparent rounded-lg'
          : 'float-right h-16 my-2 py-2 px-4 text-sm text-gray-500 bg-gray-100 outline-none border-transparent rounded-lg'
      }
      disabled={enabled ? '' : true}
    >
      <span className='text-xl'>{enabled ? ' whisper ' : ' hm... '}</span>
      <span className='text-xs'>{enabled ? ' ctrl + enter ' : ''}</span>
    </button>
  )
}

const WordCount = ({ words, letters }) => {
  return (
    <div className='float-right h-16 mr-2 my-2 py-2 px-4 text-sm text-gray-400 bg-gray-100 outline-none border-transparent rounded-lg'>
      {`${words} words`}
      <br />
      {`${letters} letters`}
    </div>
  )
}

const Post = ({}) => {
  return <div></div>
}

const PostList = ({}) => {
  return <div>PostList</div>
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
      <PostButton
        enabled={true}
        OnClick={() => console.log('Clicked!')}
      ></PostButton>
      <WordCount words={100} letters={100}></WordCount>
    </div>
  )
}

export default App
