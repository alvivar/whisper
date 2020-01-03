import React from 'react'
import Blog from './Blog'

const BlogList = ({ blogs }) => {
  return (
    <div>
      {blogs.map((item, key) => (
        <Blog key={key} content={item.name}></Blog>
      ))}
    </div>
  )
}

export default BlogList
