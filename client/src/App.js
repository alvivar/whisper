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

var randomWords = require('random-words')
const data = {
  blogs: [
    {
      name: randomWords(2),
      posts: [
        {
          title: randomWords(4),
          content: randomWords(50)
        },
        {
          title: randomWords(4),
          content: randomWords(50)
        },
        {
          title: randomWords(4),
          content: randomWords(50)
        }
      ]
    },
    {
      name: randomWords(2),
      posts: [
        {
          title: randomWords(4),
          content: randomWords(50)
        },
        {
          title: randomWords(4),
          content: randomWords(50)
        },
        {
          title: randomWords(4),
          content: randomWords(50)
        }
      ]
    },
    {
      name: randomWords(2),
      posts: [
        {
          title: randomWords(4),
          content: randomWords(50)
        },
        {
          title: randomWords(4),
          content: randomWords(50)
        },
        {
          title: randomWords(4),
          content: randomWords(50)
        }
      ]
    }
  ]
}

const Url = ({ key, content }) => {
  return (
    <button
      key={key}
      id={`post${key}`}
      className={`float-left mb-2 py-2 px-4 text-left text-gray-600 hover:text-white bg-blue-200 hover:bg-blue-400 outline-none border-transparent rounded-lg`}
    >
      <div className='text-sm'>
        {content.split('\n').map((post, key) => {
          return <span key={key}>{post}</span>
        })}
      </div>
    </button>
  )
}

const UrlList = ({}) => {
  return (
    <div className='container float-left'>
      <Url key={0} content={randomWords({ exactly: 4, join: ' ' })}></Url>
      <Url key={0} content={randomWords({ exactly: 4, join: ' ' })}></Url>
      <Url key={0} content={randomWords({ exactly: 4, join: ' ' })}></Url>
      <Url key={0} content={randomWords({ exactly: 4, join: ' ' })}></Url>
      <Url key={0} content={randomWords({ exactly: 4, join: ' ' })}></Url>
      <Url key={0} content={randomWords({ exactly: 4, join: ' ' })}></Url>
      <Url key={0} content={randomWords({ exactly: 4, join: ' ' })}></Url>
      <Url key={0} content={randomWords({ exactly: 4, join: ' ' })}></Url>
      <Url key={0} content={randomWords({ exactly: 4, join: ' ' })}></Url>
      <Url key={0} content={randomWords({ exactly: 4, join: ' ' })}></Url>
      <Url key={0} content={randomWords({ exactly: 4, join: ' ' })}></Url>
      <Url key={0} content={randomWords({ exactly: 4, join: ' ' })}></Url>
    </div>
  )
}

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
    <div className='container mx-auto max-w-4xl'>
      <div className='flex'>
        <div className='w-3/4 mt-2 pl-2'>
          <InputField
            defaultValue={title}
            OnValueChange={setTitle}
          ></InputField>
          <TextArea
            defaultValue={content}
            OnValueChange={setContent}
          ></TextArea>
          <PostButton enabled={true}></PostButton>
          <WordCount words={wordCount} letters={letterCount}></WordCount>
          <PostList
            posts={[
              {
                title: randomWords({ exactly: 4, join: ' ' }),
                content: randomWords({ exactly: 50, join: ' ' })
              },
              {
                title: randomWords({ exactly: 4, join: ' ' }),
                content: randomWords({ exactly: 50, join: ' ' })
              },
              {
                title: randomWords({ exactly: 4, join: ' ' }),
                content: randomWords({ exactly: 50, join: ' ' })
              },
              {
                title: randomWords({ exactly: 4, join: ' ' }),
                content: randomWords({ exactly: 50, join: ' ' })
              },
              {
                title: randomWords({ exactly: 4, join: ' ' }),
                content: randomWords({ exactly: 50, join: ' ' })
              }
            ]}
          ></PostList>
        </div>
        <div className='w-1/4 mt-2 pl-2'>
          <UrlList></UrlList>
        </div>
      </div>
    </div>
  )
}

export default App
