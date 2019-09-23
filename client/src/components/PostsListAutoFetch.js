import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks";
import gql from "graphql-tag";

const POSTS_BY_CHANNEL = gql`
    query postsByChannel($channel: String!, $skip: Int!, $first: Int!) {
        postsByChannel(channel: $channel, skip: $skip, first: $first) {
            content
            author {
                name
            }
            created
        }
    }
`;

const loadingMessage = () => {
    return (
        <div className="mr-2 my-2 py-2 px-4 italic text-lg text-gray-600 bg-orange-100 outline-none border-transparent rounded-lg">
            <p>Loading...</p>
        </div>
    );
};

const errorMessage = () => {
    return (
        <div className="mr-2 my-2 py-2 px-4 text-lg text-gray-600 bg-orange-100 outline-none border-transparent rounded-lg">
            <p>😯💛</p>
            <p className="italic">
                Something wrong is happening, 'll fix this as soon as possible.
            </p>
            <p className="italic">Enjoy your life in the meantime!</p>
        </div>
    );
};

const timeDifference = (current, previous) => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - previous;

    let result = 0;
    let tag = "";

    if (elapsed < msPerMinute) {
        result = Math.round(elapsed / 1000);
        tag = "seconds ago";
    } else if (elapsed < msPerHour) {
        result = Math.round(elapsed / msPerMinute);
        tag = "minutes ago";
    } else if (elapsed < msPerDay) {
        result = Math.round(elapsed / msPerHour);
        tag = "hours ago";
    } else if (elapsed < msPerMonth) {
        result = Math.round(elapsed / msPerDay);
        tag = "days ago";
    } else if (elapsed < msPerYear) {
        result = Math.round(elapsed / msPerMonth);
        tag = "months ago";
    } else {
        result = Math.round(elapsed / msPerYear);
        tag = "years ago";
    }

    return `${result < 0 ? 0 : result} ${tag}`;
};

const PostsList = ({ newPosts, channel }) => {
    // Query & pagination

    const postsBatch = 8;
    const [first, setFirst] = useState(postsBatch);

    const { loading, error, data, refetch } = useQuery(POSTS_BY_CHANNEL, {
        variables: {
            channel: channel,
            skip: 0,
            first: first
        }
    });

    // Refetch when the limit changes

    useEffect(() => {
        refetch({ first: first });
    }, [first]);

    // When the data grows move the scroll to previous bottom

    const lastPostRef = useRef();
    const [chosenPostId, setChosenPostId] = useState();

    useEffect(() => {
        if (chosenPostId) window.scrollTo(0, chosenPostId);
    }, [data]);

    // When the channel changes restart the pagination

    useEffect(() => {
        setFirst(postsBatch);
    }, [channel]);

    // In the meantime

    if (loading) return loadingMessage();
    if (error) return errorMessage();

    // Data appended as needed

    const newPostsByChannel = newPosts.filter(i =>
        i.author.name.includes(`@${channel}`)
    );

    const postsToRender = [
        ...newPostsByChannel,
        ...(data ? data.postsByChannel : [])
    ];

    // Color variation on a new author

    const bgFlow = [
        "bg-blue-200 hover:bg-blue-300",
        "bg-teal-200 hover:bg-teal-300",
        "bg-indigo-200 hover:bg-indigo-300",
        "bg-orange-200 hover:bg-orange-300",
        "bg-pink-200 hover:bg-pink-300",
        "bg-green-200 hover:bg-green-300",
        "bg-yellow-200 hover:bg-yellow-300",
        "bg-purple-200 hover:bg-purple-300",
        "bg-red-200 hover:bg-red-300",
        "bg-gray-200 hover:bg-gray-300"
    ];

    let bgFlowIndex = -1;
    let lastName = "";
    const postsWithBg = postsToRender.map(value => {
        if (lastName !== value.author.name) {
            value.firstName = true;
            lastName = value.author.name;
            bgFlowIndex = (bgFlowIndex + 1) % bgFlow.length;
        } else {
            value.firstName = false;
        }

        value.bg = bgFlow[bgFlowIndex];
        return value;
    });

    return (
        <div className="px-2">
            {postsWithBg.map((item, key) => (
                <div
                    ref={lastPostRef}
                    key={key}
                    id={`post${key}`}
                    className={`p-4 mb-2 ${item.bg} rounded-lg`}
                >
                    <div className="text-xm text-gray-600">
                        <span>{item.firstName ? item.author.name : ""} </span>
                        <span className="text-xs italic">
                            {timeDifference(
                                new Date().getTime(),
                                new Date(item.created).getTime()
                            )}
                        </span>
                    </div>
                    <div className="text-xl">
                        {/* {item.content} */}
                        {item.content.split("\n").map((item, key) => {
                            return (
                                <span key={key}>
                                    {item}
                                    <br />
                                </span>
                            );
                        })}
                    </div>
                </div>
            ))}

            {postsWithBg.length >= first ? (
                <button
                    onClick={e => {
                        setChosenPostId(document.documentElement.scrollTop);

                        let page = first + postsBatch;
                        page = page < 0 ? 0 : page;
                        setFirst(page);
                    }}
                    className={
                        "float-right h-16 w-1/4 p-4 mb-2 text-sm text-gray-500 hover:text-white bg-blue-100 hover:bg-blue-400 outline-none border-transparent rounded-lg"
                    }
                >
                    <span className="text-xl">more!</span>
                </button>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default PostsList;
