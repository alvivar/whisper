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
          <ul>
            {postsToRender.map(i => (
              <li key={i.id}>{i.content}</li>
            ))}
          </ul>
        );
      }}
    </Query>
  );
}

function App() {
  return (
    <div className="container m-4">
      <div className="container mx-auto text-center">
        <textarea className="container mx-auto rounded" />
      </div>
      <div className="container mx-auto bg-blue-200">
        <PostsList />
      </div>
    </div>
  );
}

export default App;
