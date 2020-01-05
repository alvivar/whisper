import React from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, OnBlogClick }) => {
  return blogs.map((item, key) => (
    <Blog key={key} content={item.name} OnClick={OnBlogClick}></Blog>
  ))
}

export default BlogList
