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

const CreatePost = userId => {
    let [content, setContent] = useState("");
    let [textAreaRef, setTextAreaRef] = useState();
    const createPostMutation = useMutation(POST_MUTATION);

    return (
        <div className="flex flex-wrap">
            <textarea
                ref={node => setTextAreaRef(node)}
                onChange={e => setContent(e.target.value)}
                className="w-full h-16 py-4 px-4 text-lg text-gray-900 border bg-gray-100 border-gray-100 outline-none rounded-lg focus:bg-gray-300"
            />
            <div className="w-full">
                <button
                    onClick={e => {
                        createPostMutation({
                            variables: {
                                content: content,
                                userId: userId
                            }
                        });
                        textAreaRef.value = "";
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
