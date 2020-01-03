import React from 'react'

const Blog = ({ key, content }) => {
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

export default Blog
