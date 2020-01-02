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

const TextArea = ({ defaultValue, OnValueChange }) => {
  const [value, setValue] = useState(defaultValue)
  const debouncedValue = useDebounce(value, 1000)

  const bgOk = 'bg-blue-100 focus:bg-blue-200'
  const bgEditing = 'bg-green-100 focus:bg-green-200'
  const bgError = 'bg-red-300 focus:bg-red-400'
  const [bg, setBg] = useState(bgOk)

  useEffect(() => {
    OnValueChange(debouncedValue)
    setBg(bgOk)
    console.log(`TextArea saved: ${debouncedValue}`)
  }, [debouncedValue])

  return (
    <textarea
      className={`float-left w-full h-32 py-4 px-4 text-gray-800 ${bg} border-transparent outline-none rounded-lg`}
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

const timeDifference = (current, previous) => {
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerMonth = msPerDay * 30
  const msPerYear = msPerDay * 365

  const elapsed = current - previous

  let result = 0
  let tag = ''

  if (elapsed < msPerMinute) {
    result = Math.round(elapsed / 1000)
    tag = 'seconds ago'
  } else if (elapsed < msPerHour) {
    result = Math.round(elapsed / msPerMinute)
    tag = 'minutes ago'
  } else if (elapsed < msPerDay) {
    result = Math.round(elapsed / msPerHour)
    tag = 'hours ago'
  } else if (elapsed < msPerMonth) {
    result = Math.round(elapsed / msPerDay)
    tag = 'days ago'
  } else if (elapsed < msPerYear) {
    result = Math.round(elapsed / msPerMonth)
    tag = 'months ago'
  } else {
    result = Math.round(elapsed / msPerYear)
    tag = 'years ago'
  }

  return `${result < 0 ? 0 : result} ${tag}`
}

const Post = ({
  key = 0,
  bg = '',
  name = 'name',
  created = Date.now(),
  content = "This is not exactly real, as we like it. It's a lot more complicated than that."
}) => {
  return (
    <div
      key={key}
      id={`post${key}`}
      className={`w-full p-4 mb-2 ${bg} rounded-lg`}
    >
      <div className='text-xm text-gray-600'>
        <span>{name} </span>
        <span className='text-xs italic'>
          {timeDifference(new Date().getTime(), new Date(created).getTime())}
        </span>
      </div>
      <div className='text-xl'>
        {content.split('\n').map((post, key) => {
          return (
            <span key={key}>
              {post}
              <br />
            </span>
          )
        })}
      </div>
    </div>
  )
}

const PostList = ({}) => {
  const bgFlow = [
    'bg-blue-200 hover:bg-blue-300',
    'bg-teal-200 hover:bg-teal-300',
    'bg-indigo-200 hover:bg-indigo-300',
    'bg-orange-200 hover:bg-orange-300',
    'bg-pink-200 hover:bg-pink-300',
    'bg-green-200 hover:bg-green-300',
    'bg-yellow-200 hover:bg-yellow-300',
    'bg-purple-200 hover:bg-purple-300',
    'bg-red-200 hover:bg-red-300',
    'bg-gray-200 hover:bg-gray-300'
  ]

  return (
    <div className='float-left'>
      <Post bg={bgFlow[0]}></Post>
      <Post></Post>
      <Post></Post>
      <Post></Post>
      <Post></Post>
      <Post></Post>
    </div>
  )
}

function App () {
  const [blogName, setBlogName] = useState('user@universe')
  const [postContent, setPostContent] = useState('Post content')

  const [wordCount, setWordCount] = useState(0)
  const [letterCount, setLetterCount] = useState(0)

  useEffect(() => {
    setWordCount((postContent.trim().match(/\S+/g) || []).length)
    setLetterCount(postContent.trim().length)
  }, [postContent])

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
      <WordCount words={wordCount} letters={letterCount}></WordCount>
      <PostList></PostList>
    </div>
  )
}

export default App
