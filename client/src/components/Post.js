import React from 'react'

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

const Post = ({ key, title, created, content, bg }) => {
  return (
    <div
      key={key}
      id={`post${key}`}
      className={`w-full p-4 mb-2 ${bg} rounded-lg`}
    >
      <div className='text-xm text-gray-600'>
        <span>{title} </span>
        <span className='text-xs italic'>
          {timeDifference(new Date().getTime(), new Date(created).getTime())}
        </span>
      </div>
      <div className='text-lg'>
        {content.split('\n').map((post, key) => {
          return <span key={key}>{post}</span>
        })}
      </div>
    </div>
  )
}

export default Post
