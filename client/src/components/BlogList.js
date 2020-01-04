import React from 'react'
import Blog from './Blog'

const BlogList = ({ blogs }) => {
  return blogs.map((item, key) => <Blog key={key} content={item.name}></Blog>)
}

export default BlogList
