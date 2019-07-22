import React, { useEffect, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks";
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

const NEWPOST = gql`
    subscription {
        newPost {
            id
            content
        }
    }
`;

function App() {
    const cookieName = "whisperUser";
    const [cookies, setCookie, removeCookie] = useCookies([cookieName]);

    const [user, setUser] = useState({
        id: "",
        name: "",
        sessionHash: ""
    });

    // const {
    //     loading: userLoading,
    //     error: userError,
    //     data: userData,
    //     refetch: postsRefetch
    // } = useQuery(USER_QUERY, {
    //     variables: {
    //         sessionHash: ""
    //     }
    // });

    const {
        loading: postsLoading,
        error: postsError,
        data: postsData,
        refetch: postsRefetch
    } = useQuery(POSTS_QUERY);

    const createUserMutation = useMutation(CREATE_USER_MUTATION);

    const {
        loading: newPostLoading,
        error: newPostError,
        data: newPostData
    } = useSubscription(NEWPOST, {
        onSubscriptionData: ({ client, subscriptionData }) => {
            console.log(client);
            console.log(subscriptionData);
            postsRefetch();
        }
    });

    useEffect(() => {
        if (!user.id) {
            const createUserSession = async () => {
                console.log("Creating a new user...");

                const name =
                    "anon" +
                    require("crypto")
                        .randomBytes(10)
                        .toString("hex") +
                    "@universe";

                const sessionHash = require("crypto")
                    .randomBytes(20)
                    .toString("hex");

                const result = await createUserMutation({
                    variables: {
                        name: name,
                        sessionHash: sessionHash
                    }
                });

                await setUser({
                    id: result.data.createUser.id,
                    name: result.data.createUser.name,
                    sessionHash: result.data.createUser.sessionHash
                });
            };

            createUserSession();
        }
    }, []);

    useEffect(() => {
        if (user.id) {
            console.log("sessionHash saved in the cookie...");

            setCookie(
                cookieName,
                { sessionHash: user.sessionHash },
                { path: "/" }
            );
        }
    }, [user.id]);

    return (
        <div className="container mx-auto max-w-xl">
            <CreatePost
                userId={user.id}
                userName={user.name}
                postsRefetch={postsRefetch}
            />
            <div className="container mx-auto">
                <PostsList
                    loading={postsLoading}
                    error={postsError}
                    data={postsData}
                />
            </div>
        </div>
    );
}

export default App;
