import React, { useState, useEffect } from "react";

import useInfiniteScroll from "../hooks/useInfiniteScroll";
import useDebounce from "../hooks/useDebounce";

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

// const List2 = () => {
//     const [listItems, setListItems] = useState(
//         Array.from(Array(30).keys(), n => n + 1)
//     );
//     const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

//     function fetchMoreListItems() {
//         setTimeout(() => {
//             setListItems(prevState => [
//                 ...prevState,
//                 ...Array.from(Array(20).keys(), n => n + prevState.length + 1)
//             ]);
//             setIsFetching(false);
//         }, 2000);
//     }

//     return (
//         <>
//             <ul className="list-group mb-2">
//                 {listItems.map(listItem => (
//                     <li className="list-group-item">List Item {listItem}</li>
//                 ))}
//             </ul>
//             {isFetching && "Fetching more list items..."}
//         </>
//     );
// };

const PostsList = ({ loading, error, data, newPosts, channel }) => {
    if (loading) return fetchingMessage();
    if (error) return errorMessage();

    // const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

    // function fetchMoreListItems() {
    //     setTimeout(() => {}, 2000);
    // }

    // useEffect(() => {
    //     console.log("Name modified");
    //     if (debouncedName) {
    //         const setUserName = async () => {
    //             try {
    //                 const {
    //                     loading: postsLoading,
    //                     error: postsError,
    //                     data: postsData,
    //                     refetch: postsRefetch
    //                 } = useQuery(POSTS_BY_CHANNEL, {
    //                     variables: {
    //                         channel: channel
    //                     }
    //                 });
    //                 await setUserNameMutation({
    //                     variables: {
    //                         userId: user.id,
    //                         name: debouncedName
    //                     }
    //                 });

    //                 await setUser({
    //                     id: user.id,
    //                     name: debouncedName,
    //                     sessionHash: user.sessionHash
    //                 });

    //                 setInputBg(inputBgOk);
    //                 setTextAreaBg(textAreaBgOk);
    //                 setButtonEnabled(true);
    //                 console.log("Name saved");
    //             } catch (error) {
    //                 setInputBg(inputBgError);
    //                 setButtonEnabled(false);
    //                 console.log("Name error, already in db probably");
    //             }
    //         };

    //         setUserName();
    //     }
    // }, [isFetching]);

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
                <div key={key} className={`p-4 mb-2 ${item.bg} rounded-lg`}>
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
            {/* <List2></List2> */}
        </div>
    );
};

export default PostsList;
