import React from 'react'

const Blog = ({ content, OnClick }) => {
  return (
    <button
      className={`float-left mb-2 py-2 px-4 text-left text-gray-600 hover:text-white bg-blue-200 hover:bg-blue-400 outline-none border-transparent rounded-lg`}
      onClick={e => OnClick(content)}
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
