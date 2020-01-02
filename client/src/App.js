import React, { useState, useEffect } from 'react'
import logo from './logo.svg'

import './App.css'
import './styles/index.css'
import './styles/tailwind.css'

import InputField from './components/InputField'
import TextArea from './components/TextArea'
import PostButton from './components/PostButton'
import WordCount from './components/WordCount'
import PostList from './components/PostList'

function App () {
  // Data

  const [blogName, setBlogName] = useState('user@universe')
  const [postContent, setPostContent] = useState('Post content')

  // Words & letters

  const [wordCount, setWordCount] = useState(0)
  const [letterCount, setLetterCount] = useState(0)

  useEffect(() => {
    setWordCount((postContent.trim().match(/\S+/g) || []).length)
    setLetterCount(postContent.trim().length)
  }, [postContent])

  // App

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
