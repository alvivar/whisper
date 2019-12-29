import React, { useEffect, useState, useRef } from 'react'
import { useQuery, useMutation, useSubscription } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import PostsList from './components/PostsList'
import CreatePost from './components/CreatePost'

const CREATE_USER_MUTATION = gql`
  mutation createUser($name: String!, $sessionHash: String!) {
    createUser(name: $name, sessionHash: $sessionHash) {
      id
      name
      sessionHash
    }
  }
`

const NEWPOST = gql`
  subscription newBlogPost($blogName: String!) {
    newPost(blogName: $blogName) {
      content
      author {
        name
      }
      created
    }
  }
`

function App () {
  const [user, setUser] = useState({
    id: '',
    name: '',
    sessionHash: ''
  })

  const [newPosts, setNewPosts] = useState([])

  const [buttonEnabled, setButtonEnabled] = useState(true)

  const createUserMutation = useMutation(CREATE_USER_MUTATION)

  // New post subscription

  const [blogName, setBlogName] = useState('universe')

  const {
    // loading: newPostLoading,
    // error: newPostError,
    // data: newPostData
  } = useSubscription(NEWPOST, {
    variables: {
      channel: blogName
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      console.log('PubSub NEWPOST received')
      console.log(client)
      console.log(subscriptionData)

      const newPost = subscriptionData.data.newPost
      document.title = `Whisper | ${newPost.author.name} whispers ${newPost.content}`

      setButtonEnabled(true)
      setNewPosts([newPost, ...newPosts])
    }
  })

  // New user

  useEffect(() => {
    if (!user.id) {
      const createUserSession = async () => {
        console.log('Creating a new user')

        const name =
          'anon_' +
          require('crypto')
            .randomBytes(8)
            .toString('hex') +
          '@universe'

        const sessionHash = require('crypto')
          .randomBytes(20)
          .toString('hex')

        const result = await createUserMutation({
          variables: {
            name: name,
            sessionHash: sessionHash
          }
        })

        await setUser({
          id: result.data.createUser.id,
          name: result.data.createUser.name,
          sessionHash: result.data.createUser.sessionHash
        })
      }

      createUserSession()
    }
  }, [])

  // Ref to the posts list end

  const firstPost = useRef(null)
  const lastPost = useRef(null)

  return (
    <div className='container mx-auto max-w-xl'>
      <CreatePost
        user={user}
        setUser={setUser}
        channel={blogName}
        setChannel={setBlogName}
        buttonEnabled={buttonEnabled}
        setButtonEnabled={setButtonEnabled}
      />

      <div style={{ float: 'left', clear: 'both' }} ref={firstPost}></div>
      <PostsList newPosts={newPosts} channel={blogName} />
      <div style={{ float: 'left', clear: 'both' }} ref={lastPost}></div>
    </div>
  )
}

export default App
