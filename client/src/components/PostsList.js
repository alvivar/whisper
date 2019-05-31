import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const POSTS_QUERY = gql`
  query {
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

export default PostsList;
