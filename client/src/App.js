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

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  // Words & letters

  const [wordCount, setWordCount] = useState(0)
  const [letterCount, setLetterCount] = useState(0)

  useEffect(() => {
    setWordCount((content.trim().match(/\S+/g) || []).length)
    setLetterCount(content.trim().length)
  }, [content])

  // App

  return (
    <div className='container mx-auto max-w-3xl'>
      <InputField defaultValue={title} OnValueChange={setTitle}></InputField>
      <TextArea defaultValue={content} OnValueChange={setContent}></TextArea>
      <PostButton enabled={true}></PostButton>
      <WordCount words={wordCount} letters={letterCount}></WordCount>
      <PostList></PostList>
    </div>
  )
}

export default App
