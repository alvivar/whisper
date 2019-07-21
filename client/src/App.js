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
    const [cookies, setCookie, removeCookie] = useCookies([cookieName]);

    const [user, setUser] = useState({
        id: -1,
        name: "",
        sessionHash: ""
    });

    let [sessionHash, setSessionHash] = useState("");

    const { loading: userLoading, error: userError, data: userData } = useQuery(
        USER_QUERY,
        {
            variables: {
                sessionHash: sessionHash
            }
        }
    );

    const {
        loading: postsLoading,
        error: postsError,
        data: postsData
    } = useQuery(POSTS_QUERY);

    const createUserMutation = useMutation(CREATE_USER_MUTATION);

    useEffect(() => {
        if (user.id < 0) {
            // Look in the cookie for the session hash
            if (cookies.whisperUser) {
                const validateUserCookie = async () => {
                    console.log("Cookie found!");
                    console.log(cookies.whisperUser);

                    await setSessionHash(cookies.whisperUser.sessionHash);

                    if (userData && userData.hasOwnProperty("user")) {
                        if (userData.user) {
                            console.log("User from cookie session exists!");
                            console.log(userData.user);

                            await setUser({
                                id: userData.user.id,
                                name: userData.user.name,
                                sessionHash: sessionHash
                            });
                        } else {
                            // Lost cookie
                            console.log("Removing cookie because deprecated");
                            removeCookie(cookieName, { path: "/" });
                        }
                    }
                };

                validateUserCookie();
            }
            // Create a new user and save the cookie info
            else {
                const createUserSession = async () => {
                    console.log("Creating a new user:");

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

                    await setUser({
                        id: result.data.createUser.id,
                        name: result.data.createUser.name,
                        sessionHash: result.data.createUser.sessionHash
                    });

                    console.log("User id:");
                    console.log(user.id);

                    await setCookie(
                        cookieName,
                        {
                            sessionHash: result.data.createUser.sessionHash
                        },
                        { path: "/" }
                    );
                };

                createUserSession();
            }
        }
    }, [user.id, cookies.whisperUser, createUserMutation, setCookie]);

    return (
        <div className="container mx-auto max-w-xl">
            <div className="h-2" />
            <CreatePost userId={user.id} userName={user.name} />
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
