import React from 'react'
import Post from './Post'

const PostList = ({ posts }) => {
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

  let bgIndex = 0
  return (
    <div className='container float-left'>
      {posts.map((item, key) => (
        <Post
          key={key}
          title={item.title}
          content={item.content + ''}
          created={Date.now()}
          bg={bgFlow[bgIndex++ % bgFlow.length]}
        ></Post>
      ))}
    </div>
  )
}

export default PostList
