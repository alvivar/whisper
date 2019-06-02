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
            created
        }
    }
`;

function fetchingMessage() {
    return (
        <div className="p-4 text-center text-lg text-gray-700 italic rounded-lg">
            Loading...
        </div>
    );
}

function errorMessage() {
    return (
        <div className="p-4 bg-blue-100 text-center text-lg text-gray-700 italic rounded-lg">
            <p>Something wrong just happen!</p>
            <p>An alert has been send, I'll fixing this as soon as possible!</p>
            <p>Enjoy your life in the meantime!</p>
        </div>
    );
}

function timeDifference(current, previous) {
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + " seconds ago";
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + " minutes ago";
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + " hours ago";
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + " days ago";
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + " months ago";
    } else {
        return Math.round(elapsed / msPerYear) + " years ago";
    }
}

function PostsList() {
    return (
        <Query query={POSTS_QUERY}>
            {({ loading, error, data }) => {
                if (loading) return fetchingMessage();
                if (error) return errorMessage();
                const postsToRender = data.allowedPosts;
                return (
                    <div className="">
                        {postsToRender.map(i => (
                            <div
                                key={i.id}
                                className="p-4 mb-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                <div className="text-xs text-gray-600">
                                    @{i.author.id}{" "}
                                    {timeDifference(
                                        new Date().getTime(),
                                        new Date(i.created).getTime()
                                    )}
                                </div>
                                <div className="text-lg">{i.content}</div>
                            </div>
                        ))}
                    </div>
                );
            }}
        </Query>
    );
}

export default PostsList;
