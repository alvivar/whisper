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
    userId: "cjw7b3mmd004407271ba3o6p1"
  };

  render() {
    let textArea;
    const { content, userId } = this.state;

    return (
      <div>
        <div className="flex">
          <Mutation mutation={POST_MUTATION}>
            <textarea
              ref={node => (textArea = node)}
              onChange={e => this.setState({ content: e.target.value })}
              className="w-10/12 m-1 bg-gray-100 text-gray-800 border border-gray-200 focus:bg-white rounded"
            />
            {(postMutation, { loading, error, data }) => (
              <button
                onClick={e => {
                  postMutation({
                    variables: { content: content, userId: userId }
                  });
                  textArea.value = "";
                }}
                className="w-2/12 m-1 bg-transparent hover:bg-blue-400 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              >
                WHISPER
              </button>
            )}
          </Mutation>
        </div>
      </div>
    );
  }
}

export default CreatePost;
