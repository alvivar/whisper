import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";

import useKeyPress from "../hooks/useKeyPress";
import useDebounce from "../hooks/useDebounce";

const POST_MUTATION = gql`
    mutation createDraft($content: String!, $userId: ID!) {
        createDraft(content: $content, userId: $userId) {
            id
        }
    }
`;

const SET_USER_NAME_MUTATION = gql`
    mutation setUserName($userId: ID!, $name: String!) {
        setUserName(userId: $userId, name: $name) {
            id
            name
        }
    }
`;

const CreatePost = ({ userId, userName, postsRefetch }) => {
    const createPostMutation = useMutation(POST_MUTATION);
    const setUserNameMutation = useMutation(SET_USER_NAME_MUTATION);

    const [name, setName] = useState(userName);
    const [content, setContent] = useState("");
    const [textArea, setTextArea] = useState();

    const debouncedNewName = useDebounce(name, 1000);

    const ctrlKeyDown = useKeyPress("Control");
    const enterKeyDown = useKeyPress("Enter");

    const createPost = async (userId, content) => {
        await createPostMutation({
            variables: {
                content: content,
                userId: userId
            }
        });

        setContent("");
        textArea.focus();
        postsRefetch();
    };

    useEffect(() => {
        console.log("Trimming name");
        if (!name.trim()) setName(userName);
    }, [name, userName]);

    useEffect(() => {
        console.log("New name detected");
        if (debouncedNewName && debouncedNewName !== userName) {
            console.log("Saving new name");
            setUserNameMutation({
                variables: {
                    userId: userId,
                    name: debouncedNewName
                }
            });
        }
    }, [debouncedNewName]);

    useEffect(() => {
        console.log("Detecting Ctrl + Enter");
        if (ctrlKeyDown && enterKeyDown) {
            console.log("Ctrl + Enter pressed");
            createPost(userId, content);
        }
    }, [ctrlKeyDown, enterKeyDown]);

    return (
        <div className="flex flex-wrap">
            <div className="w-full mb-2">
                <input
                    className="w-2/3 py-2 px-2 float-right text-right text-gray-900 bg-gray-100 border-transparent outline-none rounded-lg focus:bg-gray-300"
                    onChange={e => setName(e.target.value)}
                    value={name}
                />
            </div>
            <textarea
                ref={node => setTextArea(node)}
                className="w-full h-16 py-4 px-4 text-lg text-gray-900 border bg-gray-100 border-gray-100 outline-none rounded-lg focus:bg-gray-300"
                onChange={e => setContent(e.target.value)}
                value={content}
            />
            <div className="w-full">
                <button
                    onClick={e => {
                        if (userId) createPost(userId, content);
                    }}
                    className="my-2 h-12 mx-4 py-2 px-4 float-right text-gray-600 outline-none hover:bg-black hover:text-white bg-transparent border-transparent rounded-lg"
                >
                    ( whisper )
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
