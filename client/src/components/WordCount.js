import React from 'react'

const WordCount = ({ words, letters }) => {
  return (
    <div className='float-right h-16 mr-2 my-2 py-2 px-4 text-sm text-gray-600 bg-gray-300 outline-none border-transparent rounded-lg'>
      {`${words} words`}
      <br />
      {`${letters} letters`}
    </div>
  )
}

export default WordCount
