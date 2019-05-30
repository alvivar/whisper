import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./App.css";

const POSTS_QUERY = gql`
  {
    allowedPosts {
      id
      content
    }
  }
`;

function PostsList() {
  return (
    <Query query={POSTS_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <div>Fetching</div>;
        if (error) return <div>Error</div>;

        console.log(data);

        const postsToRender = data.allowedPosts;
        return (
          <div className="m-1">
            {postsToRender.map(i => (
              <div key={i.id}>{i.content}</div>
            ))}
          </div>
        );
      }}
    </Query>
  );
}

function App() {
  return (
    <div className="container mx-auto max-w-xl">
      <div className="text-center m-4">Whisper</div>
      <div className="flex">
        <textarea className="w-10/12 m-1 bg-gray-100 text-gray-800 border border-gray-200 focus:bg-white rounded" />
        <button className="w-2/12 m-1 bg-transparent hover:bg-blue-400 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
          OK
        </button>
      </div>
      <div className="container mx-auto">
        <PostsList />
      </div>
    </div>
  );
}

export default App;
