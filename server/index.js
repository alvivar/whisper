const { prisma } = require("./generated/prisma-client");
const { GraphQLServer } = require("graphql-yoga");

const resolvers = {
    Query: {
        publishedPosts(root, args, context) {
            return context.prisma.posts({ where: { published: true } });
        },
        post(root, args, context) {
            return context.prisma.post({ id: args.postId });
        },
        postsByUser(root, args, context) {
            return context.prisma
                .user({
                    id: args.userId
                })
                .posts();
        }
    },
    Mutation: {
        createDraft(root, args, context) {
            return context.prisma.createPost({
                title: args.title,
                author: {
                    connect: { id: args.userId }
                }
            });
        },
        publish(root, args, context) {
            return context.prisma.updatePost({
                where: { id: args.postId },
                data: { published: true }
            });
        },
        createUser(root, args, context) {
            return context.prisma.createUser({ name: args.name });
        }
    },
    User: {
        posts(root, args, context) {
            return context.prisma
                .user({
                    id: root.id
                })
                .posts();
        }
    },
    Post: {
        author(root, args, context) {
            return context.prisma
                .post({
                    id: root.id
                })
                .author();
        }
    }
};

const server = new GraphQLServer({
    typeDefs: "./schema.graphql",
    resolvers,
    context: {
        prisma
    }
});

server.start(() => console.log("Server is running on http://localhost:4000"));

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
