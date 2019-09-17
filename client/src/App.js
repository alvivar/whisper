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
    const [user, setUser] = useState({
        id: "",
        name: "",
        sessionHash: ""
    });

    const [newPosts, setNewPosts] = useState([]);

    const [buttonEnabled, setButtonEnabled] = useState(true);

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

            const newPost = subscriptionData.data.newPost;
            document.title = `Whisper | ${newPost.author.name} whispers ${newPost.content}`;

            setButtonEnabled(true);
            setNewPosts([newPost, ...newPosts]);
        }
    });

    useEffect(() => {
        if (!user.id) {
            const createUserSession = async () => {
                console.log("Creating a new user");

                const name =
                    "anon_" +
                    require("crypto")
                        .randomBytes(8)
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

    return (
        <div className="container mx-auto max-w-xl">
            <CreatePost
                user={user}
                setUser={setUser}
                channel={channel}
                setChannel={setChannel}
                buttonEnabled={buttonEnabled}
                setButtonEnabled={setButtonEnabled}
            />
            <PostsList
                loading={postsLoading}
                error={postsError}
                data={postsData}
                newPosts={newPosts}
                channel={channel}
            />
        </div>
    );
}

export default App;
