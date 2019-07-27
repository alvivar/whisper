import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks";
import { useCookies } from "react-cookie";
import gql from "graphql-tag";

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

const POSTS_BY_CHANNEL = gql`
    query postsByChannel($channel: String!) {
        postsByChannel(channel: $channel) {
            content
            author {
                name
            }
            created
        }
    }
`;

const NEWPOST = gql`
    subscription newPost($channel: String!) {
        newPost(channel: $channel) {
            content
            author {
                name
            }
            created
        }
    }
`;

function App() {
    const cookieName = "whisperUser";
    const [cookies, setCookie, removeCookie] = useCookies([cookieName]);

    const [newPosts, setNewPosts] = useState([]);

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

    const createUserMutation = useMutation(CREATE_USER_MUTATION);

    const [channel, setChannel] = useState("universe");

    const {
        loading: postsLoading,
        error: postsError,
        data: postsData,
        refetch: postsRefetch
    } = useQuery(POSTS_BY_CHANNEL, {
        variables: {
            channel: channel
        }
    });

    const {
        loading: newPostLoading,
        error: newPostError,
        data: newPostData
    } = useSubscription(NEWPOST, {
        variables: {
            channel
        },
        onSubscriptionData: ({ client, subscriptionData }) => {
            console.log("PubSub NEWPOST received");
            console.log(client);
            console.log(subscriptionData);
            setNewPosts([subscriptionData.data.newPost, ...newPosts]);
        }
    });

    useEffect(() => {
        if (!user.id) {
            const createUserSession = async () => {
                console.log("Creating a new user");

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
            console.log("sessionHash saved in the cookie");

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
                channel={channel}
                setChannel={setChannel}
            />
            <div className="container mx-auto">
                <PostsList
                    loading={postsLoading}
                    error={postsError}
                    data={postsData}
                    newPosts={newPosts}
                />
            </div>
        </div>
    );
}

export default App;
