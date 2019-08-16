const { prisma } = require("../generated/prisma-client");

// Remove users without written posts.

async function main() {
    const users = await prisma.users().$fragment(`
        fragment UsersWithoutPosts on User {
            id
            writtenPosts {
                id
            }
        }`);

    const usersWithoutPosts = users.reduce((accu, elem) => {
        if (!elem.writtenPosts.length) accu.push(elem.id);
        return accu;
    }, []);

    await prisma.deleteManyUsers({
        id_in: usersWithoutPosts
    });

    console.log(usersWithoutPosts);
    console.log(`Users without written posts deleted!`);
}

main()
    .then(() => process.exit(0))
    .catch(e => console.error(e));
