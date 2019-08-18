import React from "react";

const fetchingMessage = () => {
    return (
        <div className="p-4 text-center text-lg text-gray-700 italic rounded-lg">
            Loading...
        </div>
    );
};

const errorMessage = () => {
    return (
        <div className="p-4 bg-blue-100 text-center text-lg text-gray-700 italic rounded-lg">
            <p>Something wrong just happen!</p>
            <p>An alert has been send, I'll fixing this as soon as possible!</p>
            <p>Enjoy your life in the meantime!</p>
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

const getUserBg = (nameA, nameB, created) => {
    if (nameA.trim() === nameB.trim()) {
        // Created by itself
        return "bg-indigo-200 hover:bg-indigo-300";
    } else {
        // Create by another person
        const secondsAgo = new Date().getTime() - created;
        const isNewPost = 5 * 60 * 1000;
        const isRecentPost = 25 * 60 * 1000;

        if (secondsAgo < isNewPost) {
            return "bg-orange-200 hover:bg-orange-300";
        } else if (secondsAgo < isRecentPost) {
            return "bg-blue-200 hover:bg-blue-300";
        } else {
            return "bg-gray-200 hover:bg-gray-300";
        }
    }
};

const PostsList = ({ userName, loading, error, data, newPosts }) => {
    if (loading) return fetchingMessage();
    if (error) return errorMessage();

    const postsToRender = [...newPosts, ...(data ? data.postsByChannel : [])];

    return (
        <div className="px-2">
            {postsToRender.map((item, key) => (
                <div
                    key={key}
                    className={`p-4 mb-2
                    ${getUserBg(
                        item.author.name,
                        userName,
                        new Date(item.created).getTime()
                    )} rounded-lg`}
                >
                    <div className="text-xm text-gray-600">
                        <span>{item.author.name} </span>
                        <span className="text-xs italic">
                            {timeDifference(
                                new Date().getTime(),
                                new Date(item.created).getTime()
                            )}
                        </span>
                    </div>
                    <div className="text-xl">
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
        </div>
    );
};

export default PostsList;
