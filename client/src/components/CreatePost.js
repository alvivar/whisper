import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";

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

const CreatePost = ({ userId, userName }) => {
    let [name, setName] = useState(userName);
    let [content, setContent] = useState("");
    let [inputField, setInputField] = useState();
    let [textArea, setTextArea] = useState();

    const createPostMutation = useMutation(POST_MUTATION);
    const setUserNameMutation = useMutation(SET_USER_NAME_MUTATION);

    return (
        <div className="flex flex-wrap">
            {name}
            <div className="w-full mb-2">
                <input
                    ref={node => setInputField(node)}
                    className="w-2/3 py-2 px-2 float-right text-right text-gray-900 border-transparent bg-gray-100 outline-none rounded-lg focus:bg-gray-300"
                    onChange={e => {
                        setUserNameMutation({
                            variables: {
                                userId: userId,
                                name: e.target.value
                            }
                        });
                        setName(e.target.value);
                    }}
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
                        if (userId) {
                            createPostMutation({
                                variables: {
                                    content: content,
                                    userId: userId
                                }
                            });
                            textArea.value = "";
                        }
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
