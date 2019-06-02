import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const POSTS_QUERY = gql`
    query {
        allowedPosts {
            id
            content
            author {
                id
            }
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
                    <div className="mt-1">
                        {postsToRender.map(i => (
                            <div
                                key={i.id}
                                className="my-2 p-2 border-8 border-gray-900 hover:bg-gray-100"
                            >
                                <div className="text-xs">@{i.author.id}</div>
                                <div>{i.content}</div>
                            </div>
                        ))}
                    </div>
                );
            }}
        </Query>
    );
}

export default PostsList;
