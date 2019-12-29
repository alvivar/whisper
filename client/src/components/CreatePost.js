import React, { useState, useEffect } from 'react'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo-hooks'

import useKeyPress from '../hooks/useKeyPress'
import useDebounce from '../hooks/useDebounce'

const CREATEPOST = gql`
  mutation createPost($content: String!, $userId: String!, $blogId: ID!) {
    createPost(content: $content, userId: $userId, blogId: $blogId) {
      id
    }
  }
`

const SETUSERNAME = gql`
  mutation setUserName($userId: ID!, $name: String!) {
    setUserName(userId: $userId, name: $name) {
      id
      name
    }
  }
`

const CreatePost = ({
  user,
  setUser,
  blogName,
  setBlogName,
  buttonEnabled,
  setButtonEnabled
}) => {
  const createPostMutation = useMutation(CREATEPOST)
  const setUserNameMutation = useMutation(SETUSERNAME)

  const [name, setName] = useState(user.name)
  const debouncedName = useDebounce(name, 1000)

  const inputBgOk = 'bg-blue-100 focus:bg-blue-200'
  const inputBgEditing = 'bg-green-100 focus:bg-green-200'
  const inputBgError = 'bg-red-300 focus:bg-red-400'
  const [inputBg, setInputBg] = useState(inputBgOk)

  const textAreaBgOk = 'bg-blue-100 focus:bg-blue-200'
  const textAreaBgError = 'bg-red-300 focus:bg-red-400'
  const [textAreaBg, setTextAreaBg] = useState(textAreaBgOk)
  const [textArea, setTextArea] = useState()

  const [contentWords, setContentWords] = useState(0)
  const [contentLetters, setContentLetters] = useState(0)
  const [content, setContent] = useState('')

  const [blogNameToDebounce, setBlogNameToDebounce] = useState(blogName)
  const deboundedBlogName = useDebounce(blogNameToDebounce, 1000)

  const ctrlKeyDown = useKeyPress('Control')
  const enterKeyDown = useKeyPress('Enter')

  const createPost = async (userId, blogId, content) => {
    if (!content.trim()) {
      textArea.focus()
      setTextAreaBg(textAreaBgError)
      console.log("Can't create an empty post")
      return false
    }

    setButtonEnabled(false)
    await createPostMutation({
      variables: {
        userId: userId,
        blogId: blogId.trim(),
        content: content.trim()
      }
    })

    setContent('')
    console.log('Post created')
  }

  useEffect(() => {
    console.log('Trimming name')
    if (!name.trim()) {
      setName(user.name)
      setInputBg(inputBgOk)
    }
  }, [name, user.name])

  // When the content changes
  useEffect(() => {
    setContentWords((content.trim().match(/\S+/g) || []).length)
    setContentLetters(content.trim().length)
    setTextAreaBg(textAreaBgOk)
  }, [content])

  // When the name should be saved, after debouncing
  useEffect(() => {
    console.log('Name modified')
    if (debouncedName) {
      const setUserName = async () => {
        try {
          await setUserNameMutation({
            variables: {
              userId: user.id,
              name: debouncedName
            }
          })

          await setUser({
            id: user.id,
            name: debouncedName,
            sessionHash: user.sessionHash
          })

          setInputBg(inputBgOk)
          setTextAreaBg(textAreaBgOk)
          setButtonEnabled(true)
          console.log('Name saved')
        } catch (error) {
          setInputBg(inputBgError)
          setButtonEnabled(false)
          console.log('Name error, already in db probably')
        }
      }

      setUserName()
    }
  }, [debouncedName])

  // Channel extraction to debounce
  useEffect(() => {
    console.log(`Extracting channel from ${name}`)
    if (name.includes('@')) {
      let channel = name.split('@')[1].trim() || '@'
      channel = channel ? channel : '@'
      setBlogNameToDebounce(channel)
    } else {
      setBlogNameToDebounce(name.trim())
    }
  }, [name])

  // Channel debounced
  useEffect(() => {
    console.log('Channel modified')
    if (deboundedBlogName && deboundedBlogName !== blogName) {
      setBlogName(deboundedBlogName)
      console.log(`Saving new channel: ${deboundedBlogName}`)
    }
  }, [deboundedBlogName])

  // Ctrl+Enter to post
  useEffect(() => {
    console.log('Detecting Ctrl + Enter')
    if (ctrlKeyDown && enterKeyDown) {
      console.log('Ctrl + Enter pressed')
      createPost(user.id, blogName, content)
    }
  }, [ctrlKeyDown, enterKeyDown])

  return (
    <div className='flex flex-wrap px-2'>
      <input
        className={`float-right w-full p-1 my-2 text-gray-600 focus:text-gray-800 ${inputBg} border-transparent outline-none rounded-lg`}
        onChange={e => {
          setName(e.target.value)
          setInputBg(inputBgEditing)
        }}
        value={name}
      />
      <textarea
        ref={node => setTextArea(node)}
        className={`w-full h-32 py-4 px-4 text-gray-800 ${textAreaBg} border border-transparent outline-none rounded-lg`}
        onChange={e => setContent(e.target.value)}
        value={content}
      />
      <div className='w-full'>
        <button
          onClick={e => {
            if (user.id) createPost(user.id, blogName, content)
          }}
          className={
            buttonEnabled
              ? 'float-right h-16 my-2 py-2 px-4 text-sm text-gray-500 hover:text-white bg-blue-100 hover:bg-blue-400 outline-none border-transparent rounded-lg'
              : 'float-right h-16 my-2 py-2 px-4 text-sm text-gray-500 bg-gray-100 outline-none border-transparent rounded-lg'
          }
          disabled={buttonEnabled ? '' : true}
        >
          <span className='text-xl'>
            {buttonEnabled ? ' whisper ' : ' hm... '}
          </span>
          <span className='text-xs'>
            {buttonEnabled ? ' ctrl + enter ' : ''}
          </span>
        </button>

        {contentLetters < 1 ? (
          <span />
        ) : (
          <button className='float-right h-16 mr-2 my-2 py-2 px-4 text-sm text-gray-400 outline-none bg-gray-100 border-transparent rounded-lg'>
            {`${contentWords} words`}
            <br />
            {`${contentLetters} letters`}
          </button>
        )}
      </div>
    </div>
  )
}

export default CreatePost
