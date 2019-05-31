import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const POST_MUTATION = gql`
  mutation CreateDraftMutation($content: String!, $userId: String!) {
    createDraft(content: $content, userId: $userId) {
      id
    }
  }
`;

function CreatePost(userId) {
  return (
    <div>
      <div className="flex">
        <textarea className="w-10/12 m-1 bg-gray-100 text-gray-800 border border-gray-200 focus:bg-white rounded" />
        <Mutation mutation={POST_MUTATION} variables={{ userId }}>
          {postMutation => (
            <button
              onClick={postMutation}
              className="w-2/12 m-1 bg-transparent hover:bg-blue-400 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              whisper
            </button>
          )}
        </Mutation>
      </div>
    </div>
  );
}

export default CreatePost;
