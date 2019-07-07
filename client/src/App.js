import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import { useCookies } from "react-cookie";

import PostsList from "./components/PostsList";
import CreatePost from "./components/CreatePost";

const USER_QUERY = gql`
    query user($sessionHash: String!) {
        user(sessionHash: $sessionHash) {
            id
            name
        }
    }
`;

const CREATE_USER_MUTATION = gql`
    mutation createUser($name: String!, $sessionHash: String!) {
        createUser(name: $name, sessionHash: $sessionHash) {
            id
            name
            sessionHash
        }
    }
`;

const POSTS_QUERY = gql`
    query {
        allowedPosts {
            id
            content
            author {
                id
                name
            }
            created
        }
    }
`;

function App() {
    const cookieName = "whisperUser";
    const [cookies, setCookie] = useCookies([cookieName]);

    const [user, setUser] = useState({ id: -1, name: "", sessionHash: "" });

    const { data, error, loading } = useQuery(POSTS_QUERY);

    const { userLoading, userError, userData } = useQuery(USER_QUERY, {
        variables: { sessionHash: user.sessionHash }
    });

    const createUserMutation = useMutation(CREATE_USER_MUTATION);

    useEffect(() => {
        if (user.id < 0) {
            // Look in the cookie for session hash
            if (cookies.whisperUser) {
                console.log(cookies.whisperUser);
                setUser(cookies.whisperUser);
            }
            // Create a new user and save the cookie info
            else {
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

                    await setCookie(
                        cookieName,
                        {
                            id: result.data.createUser.id,
                            name: result.data.createUser.name,
                            sessionHash: result.data.createUser.sessionHash
                        },
                        { path: "/" }
                    );

                    await setUser({
                        id: result.data.createUser.id,
                        name: result.data.createUser.name,
                        sessionHash: result.data.createUser.sessionHash
                    });
                };

                createUserSession();
            }
        } else {
        }
    }, [user.id, cookies.whisperUser, createUserMutation, setCookie]);

    return (
        <div className="container mx-auto max-w-xl">
            <div className="h-2" />
            <CreatePost userId={user.id} userName={user.name} />
            <div className="container mx-auto">
                <PostsList loading={loading} error={error} data={data} />
            </div>
        </div>
    );
}

export default App;
