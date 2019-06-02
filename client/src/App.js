import React, { useEffect } from "react";
import PostsList from "./components/PostsList";
import CreatePost from "./components/CreatePost";

import { useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";

import { useCookies } from "react-cookie";

const CREATE_USER_MUTATION = gql`
    mutation CreateUserMutation($name: String!, $sessionHash: String!) {
        mutation {
            createUser(name: $name, sessionHash: $sessionHash) {
                id
            }
        }
    }
`;

function App() {
    const [cookies, setCookie] = useCookies(["user"]);
    // const createUserMutation = useMutation(CREATE_USER_MUTATION);

    useEffect(() => {
        if (cookies.name) {
            // get id
        } else {
            setCookie("user", "randomhash", { path: "/" });
            // createUserMutation({
            //     variables: {
            //         user: "randomhashName",
            //         sessionHash: "randomhash"
            //     }
            // });
        }
    });

    return (
        <div className="container mx-auto max-w-xl">
            <div className="h-2" />
            <p>{cookies.name}</p>
            <CreatePost name={cookies.name} />
            <div className="container mx-auto">
                <PostsList />
            </div>
        </div>
    );
}

export default App;
