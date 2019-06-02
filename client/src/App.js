import React, { useEffect } from "react";
import PostsList from "./components/PostsList";
import CreatePost from "./components/CreatePost";

import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";

import { useCookies } from "react-cookie";

const CREATE_USER_MUTATION = gql`
    mutation createUser($name: String!, $sessionHash: String!) {
        createUser(name: $name, sessionHash: $sessionHash) {
            id
            name
        }
    }
`;

function App() {
    const [cookies, setCookie] = useCookies(["user"]);
    const createUserMutation = useMutation(CREATE_USER_MUTATION);

    useEffect(() => {
        if (!cookies.user) {
            const handleUserSession = async () => {
                const sessionHash = "bewareofthesciencebehindyoursould";
                const result = await createUserMutation({
                    variables: {
                        name: sessionHash,
                        sessionHash: sessionHash
                    }
                });

                setCookie(
                    "user",
                    {
                        name: sessionHash,
                        sessionHash: sessionHash
                    },
                    { path: "/" }
                );
            };

            handleUserSession();
        } else {
        }
    });

    return (
        <div className="container mx-auto max-w-xl">
            <div className="h-2" />
            <CreatePost userId={cookies.user.id} />
            <div className="container mx-auto">
                <PostsList />
            </div>
        </div>
    );
}

export default App;
