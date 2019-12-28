const { prisma } = require("./generated/prisma-client");
const { GraphQLServer } = require("graphql-yoga");
const moment = require("moment");

const Redis = require("ioredis");
const PubSubOptions = {
    // host: "192.168.99.100", // @docker toolbox fix
    host: "127.0.0.1",
    port: "6379",
    password: "REDIS_SECRET_20191227190143",
    retryStrategy: times => Math.min(times * 50, 2000)
};


const { RedisPubSub } = require("graphql-redis-subscriptions");
const PUBSUB_NEWPOST = "NEWPOST";
const pubsub = new RedisPubSub({
    publisher: new Redis(PubSubOptions),
    subscriber: new Redis(PubSubOptions)
});

// ^ @todo @environment
console.log(process.env.PRISMA_MANAGEMENT_API_SECRET);

const resolvers = {
    Query: {
        user(root, args, context) {
            return context.prisma.user({ sessionHash: args.sessionHash });
        },
        allowedPosts(root, args, context) {
            return context.prisma.posts({
                where: { expired: false },
                orderBy: "created_DESC"
            });
        },
        publishedPosts(root, args, context) {
            return context.prisma.posts({
                where: { published: true }
            });
        },
        post(root, args, context) {
            return context.prisma.post({ id: args.postId });
        },
        postsByUser(root, args, context) {
            return context.prisma.user({ id: args.userId }).post();
        },
        postsByChannel(root, { channel, skip, first }, context) {
            return context.prisma.posts({
                where: { channel: channel },
                orderBy: "created_DESC",
                skip: skip,
                first: first
            });
        }
    },
    Mutation: {
        createUser(root, args, context) {
            return context.prisma.createUser({
                name: args.name,
                sessionHash: args.sessionHash
            });
        },
        setUserName(root, args, context) {
            return context.prisma.updateUser({
                where: { id: args.userId },
                data: {
                    name: args.name
                }
            });
        },
        async createDraft(root, args, context) {
            const post = await context.prisma.createPost({
                channel: args.channel,
                content: args.content,
                author: {
                    connect: { id: args.userId }
                },
                expiration: moment()
                    .add("1", "hour")
                    .format()
            });

            pubsub.publish(`${PUBSUB_NEWPOST}.${args.channel}`, {
                newPost: post
            });

            return post;
        },
        publish(root, args, context) {
            return context.prisma.updatePost({
                where: { id: args.postId },
                data: {
                    published: true
                }
            });
        },
        like(root, args, context) {
            return context.prisma.updatePost({
                where: { id: args.postId },
                data: {
                    likedBy: {
                        connect: { id: args.userId }
                    },
                    expiration: moment()
                        .add("1", "hour")
                        .format()
                }
            });
        },
        dislike(root, args, context) {
            return context.prisma.updatePost({
                where: { id: args.postId },
                data: {
                    likedBy: {
                        disconnect: { id: args.userId }
                    },
                    expiration: moment()
                        .subtract("10", "minutes")
                        .format()
                }
            });
        }
    },
    Subscription: {
        newPost: {
            subscribe: async (root, args, context) => {
                return pubsub.asyncIterator(
                    `${PUBSUB_NEWPOST}.${args.channel}`
                );
            }
        }
    },
    User: {
        writtenPosts(root, args, context) {
            return context.prisma
                .user({
                    id: root.id
                })
                .writtenPosts();
        },
        likedPosts(root, args, context) {
            return context.prisma
                .user({
                    id: root.id
                })
                .likedPosts();
        }
    },
    Post: {
        author(root, args, context) {
            return context.prisma
                .post({
                    id: root.id
                })
                .author();
        },
        likedBy(root, args, context) {
            return context.prisma
                .post({
                    id: root.id
                })
                .likedBy();
        }
    }
};

const server = new GraphQLServer({
    typeDefs: "./models/schema.graphql",
    resolvers,
    context: { prisma }
});

server.start(() => console.log("Server is running on http://127.0.0.1:4000"));

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
