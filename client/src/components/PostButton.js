import React from 'react'

const PostButton = ({ enabled, OnClick }) => {
  return (
    <button
      onClick={() => {
        if (OnClick) OnClick()
      }}
      className={
        enabled
          ? 'float-right h-16 my-2 py-2 px-4 text-sm text-gray-500 hover:text-white bg-blue-200 hover:bg-blue-400 outline-none border-transparent rounded-lg'
          : 'float-right h-16 my-2 py-2 px-4 text-sm text-gray-500 bg-gray-200 outline-none border-transparent rounded-lg'
      }
      disabled={enabled ? '' : true}
    >
      <span className='text-xl'>{enabled ? ' whisper ' : ' hm... '}</span>
      <span className='text-xs'>{enabled ? ' ctrl+enter ' : ''}</span>
    </button>
  )
}

export default PostButton
