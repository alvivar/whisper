import React, { useEffect, useState, useRef } from 'react'
import { useMutation, useSubscription } from 'react-apollo-hooks'
import gql from 'graphql-tag'

import PostsList from './components/PostsList'
import CreatePost from './components/CreatePost'

const CREATEUSER = gql`
  mutation createUser($name: String!, $sessionHash: String!) {
    createUser(name: $name, sessionHash: $sessionHash) {
      id
      name
      sessionHash
    }
  }
`

const NEWBLOGPOST = gql`
  subscription newBlogPost($blogName: String!) {
    newBlogPost(blogName: $blogName) {
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

  const createUserMutation = useMutation(CREATEUSER)

  // New post subscription

  const [blogName, setBlogName] = useState('universe')

  const {
    // loading: newPostLoading,
    // error: newPostError,
    // data: newPostData
  } = useSubscription(NEWBLOGPOST, {
    variables: {
      blogName: blogName
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      console.log('PubSub NEWPOST received')
      console.log(client)
      console.log(subscriptionData)

      const newBlogPost = subscriptionData.data.newBlogPost
      document.title = `Whisper | ${newBlogPost.author.name} whispers ${newBlogPost.content}`

      setButtonEnabled(true)
      setNewPosts([newBlogPost, ...newPosts])
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
        blogName={blogName}
        setBlogName={setBlogName}
        buttonEnabled={buttonEnabled}
        setButtonEnabled={setButtonEnabled}
      />

      <div style={{ float: 'left', clear: 'both' }} ref={firstPost}></div>
      {/* <PostsList newPosts={newPosts} channel={blogName} /> */}
      <div style={{ float: 'left', clear: 'both' }} ref={lastPost}></div>
    </div>
  )
}

export default App
