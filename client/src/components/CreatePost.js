import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const POST_MUTATION = gql`
    mutation CreateDraftMutation($content: String!, $userId: ID!) {
        createDraft(content: $content, userId: $userId) {
            id
        }
    }
`;

class CreatePost extends Component {
    state = {
        content: "",
        userId: "cjw64p0od00do07713xhr0esc"
    };

    render() {
        let textArea;
        const { content, userId } = this.state;

        return (
            <div className="flex flex-wrap">
                <textarea
                    ref={node => (textArea = node)}
                    onChange={e => this.setState({ content: e.target.value })}
                    className="w-full h-16 py-4 px-4 text-lg text-gray-900 border bg-gray-100 border-gray-100 outline-none rounded-lg focus:bg-gray-300"
                />
                <div className="w-full">
                    <Mutation mutation={POST_MUTATION}>
                        {(postMutation, { loading, error, data }) => (
                            <button
                                onClick={e => {
                                    postMutation({
                                        variables: {
                                            content: content,
                                            userId: userId
                                        }
                                    });
                                    textArea.value = "";
                                }}
                                className="my-2 h-12 mx-4 py-2 px-4 float-right text-gray-600 outline-none hover:bg-black hover:text-white bg-transparent border-transparent rounded-lg"
                            >
                                ( whisper )
                            </button>
                        )}
                    </Mutation>
                </div>
            </div>
        );
    }
}

export default CreatePost;
