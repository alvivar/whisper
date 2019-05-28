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
    <div className="App">
      <div className="text-center">
        <header className="bg-purple-darker m-6 p-6 rounded shadow-lg">
          <h1 className="text-black text-3xl">Welcome to React</h1>
        </header>
        <p className="text-base">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p className="text-base">
          <PostsList />
        </p>
      </div>
    </div>
  );
}

export default App;
