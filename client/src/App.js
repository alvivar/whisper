import React from "react";
import "./App.css";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const FEED_QUERY = gql`
  {
    allowedPosts {
      id
      content
    }
  }
`;

function PostsList() {
  return (
    <Query query={FEED_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <div>Fetching</div>;
        if (error) {
          console.log(error);
          console.log(data);
          return <div>Error</div>;
        }
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
    <div className="App">
      <PostsList />
    </div>
  );
}

export default App;
