const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
const moment = require('moment')

const Redis = require('ioredis')
const PubSubOptions = {
  // host: "192.168.99.100", // @docker toolbox fix
  host: '127.0.0.1',
  port: '6379',
  password: 'REDIS_SECRET_20191227190143',
  retryStrategy: times => Math.min(times * 50, 2000)
}

const { RedisPubSub } = require('graphql-redis-subscriptions')
const pubsub = new RedisPubSub({
  publisher: new Redis(PubSubOptions),
  subscriber: new Redis(PubSubOptions)
})

const PUBSUB_NEWPOST = 'NEWPOST'

// ^ @todo @environment
console.log(process.env.PRISMA_MANAGEMENT_API_SECRET)

const resolvers = {
  Query: {
    user (root, args, context) {
      return context.prisma.user({ sessionHash: args.sessionHash })
    },
    allowedPosts (root, args, context) {
      return context.prisma.posts({
        where: { expired: true },
        orderBy: 'created_DESC'
      })
    },
    publishedPosts (root, args, context) {
      return context.prisma.posts({
        where: { published: true }
      })
    },
    post (root, args, context) {
      return context.prisma.post({ id: args.postId })
    },
    postsByUser (root, args, context) {
      return context.prisma.user({ id: args.userId }).post()
    },
    blogPosts (root, args, context) {
      return context.prisma.blog({ name: args.name }).posts({
        orderBy: 'created_DESC',
        skip: args.skip,
        first: args.first
      })
    }
  },
  Mutation: {
    createUser (root, args, context) {
      return context.prisma.createUser({
        name: args.name,
        sessionHash: args.sessionHash
      })
    },
    async createBlog (root, { name }, context) {
      return context.prisma.createBlog({
        name: name
      })
    },
    async createPost (root, { content, userId, blogId }, context) {
      const post = await context.prisma.createPost({
        author: {
          connect: { id: userId }
        },
        blog: {
          connect: {
            id: blogId
          }
        },
        published: true,
        content: content
      })

      pubsub.publish(`${PUBSUB_NEWPOST}.${blogId}`, {
        newPost: post
      })

      return post
    },
    setUserName (root, args, context) {
      return context.prisma.updateUser({
        where: { id: args.userId },
        data: {
          name: args.name
        }
      })
    },
    publish (root, args, context) {
      return context.prisma.updatePost({
        where: { id: args.postId },
        data: {
          published: true
        }
      })
    },
    like (root, args, context) {
      return context.prisma.updatePost({
        where: { id: args.postId },
        data: {
          likedBy: {
            connect: { id: args.userId }
          }
        }
      })
    },
    dislike (root, args, context) {
      return context.prisma.updatePost({
        where: { id: args.postId },
        data: {
          likedBy: {
            disconnect: { id: args.userId }
          }
        }
      })
    }
  },
  Subscription: {
    newPost: {
      subscribe: async (root, args, context) => {
        return pubsub.asyncIterator(`${PUBSUB_NEWPOST}.${args.channel}`)
      }
    }
  },
  User: {
    writtenPosts (root, args, context) {
      return context.prisma
        .user({
          id: root.id
        })
        .writtenPosts()
    },
    likedPosts (root, args, context) {
      return context.prisma
        .user({
          id: root.id
        })
        .likedPosts()
    }
  },
  Blog: {
    posts (root, args, context) {
      return context.prisma
        .blog({
          id: root.id
        })
        .posts()
    }
  },
  Post: {
    author (root, args, context) {
      return context.prisma
        .post({
          id: root.id
        })
        .author()
    },
    likedBy (root, args, context) {
      return context.prisma
        .post({
          id: root.id
        })
        .likedBy()
    },
    blog (root, args, context) {
      return context.prisma
        .post({
          id: root.id
        })
        .blog()
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './models/schema.graphql',
  resolvers,
  context: { prisma }
})

server.start(() => console.log('Server is running on http://127.0.0.1:4000'))

//
// 2
//

// const { prisma } = require("./generated/prisma-client");

// // A `main` function so that we can use async/await
// async function main() {
//     // Create a new user with a new post
//     const newUser = await prisma.createUser({
//         name: "Bob",
//         email: "bob@prisma.io",
//         posts: {
//             create: [
//                 {
//                     title: "Join us for GraphQL Conf in 2019"
//                 },
//                 {
//                     title: "Subscribe to GraphQL Weekly for GraphQL news"
//                 }
//             ]
//         }
//     });
//     console.log(`Created new user: ${newUser.name} (ID: ${newUser.id})`);

//     // Read all users from the database and print them to the console
//     const allUsers = await prisma.users();
//     console.log(allUsers);

//     const allPosts = await prisma.posts();
//     console.log(allPosts);
// }

// main().catch(e => console.error(e));

//
// 1
//

// const { prisma } = require("./generated/prisma-client");

// // A `main` function so that we can use async/await
// async function main() {
//     // Create a new user called `Alice`
//     const newUser = await prisma.createUser({ name: "Alice" });
//     console.log(`Created new user: ${newUser.name} (ID: ${newUser.id})`);

//     // Read all users from the database and print them to the console
//     const allUsers = await prisma.users();
//     console.log(allUsers);
// }

// main().catch(e => console.error(e));
