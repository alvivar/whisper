import React, { useEffect } from "react";
import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import { useCookies } from "react-cookie";

import PostsList from "./components/PostsList";
import CreatePost from "./components/CreatePost";

const CREATE_USER_MUTATION = gql`
    mutation createUser($name: String!, $sessionHash: String!) {
        createUser(name: $name, sessionHash: $sessionHash) {
            id
            name
            sessionHash
        }
    }
`;

function App() {
    const cookieName = "user";
    const [cookies, setCookie] = useCookies([cookieName]);
    const createUserMutation = useMutation(CREATE_USER_MUTATION);

    useEffect(() => {
        if (!cookies.user) {
            const createUserSession = async () => {
                const name =
                    "anon" +
                    require("crypto")
                        .randomBytes(10)
                        .toString("hex");

                const sessionHash = require("crypto")
                    .randomBytes(20)
                    .toString("hex");

                const result = await createUserMutation({
                    variables: {
                        name: name,
                        sessionHash: sessionHash
                    }
                });

                setCookie(
                    cookieName,
                    {
                        id: result.data.createUser.id,
                        name: result.data.createUser.name,
                        sessionHash: result.data.createUser.sessionHash
                    },
                    { path: "/" }
                );
            };

            createUserSession();
        } else {
            // The user & the session hash needs to be validated, recreated
        }
    });

    return (
        <div className="container mx-auto max-w-xl">
            <div className="h-2" />
            <CreatePost
                userId={cookies.user ? cookies.user.id : ""}
                userName={cookies.user ? cookies.user.name : ""}
            />
            <div className="container mx-auto">
                <PostsList />
            </div>
        </div>
    );
}

export default App;
