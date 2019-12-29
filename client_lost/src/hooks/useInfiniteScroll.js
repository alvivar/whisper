// Found here https://github.com/upmostly/react-hooks-infinite-scroll
// 2019/09/17 11:46 pm

import { useState, useEffect } from "react";

const useInfiniteScroll = callback => {
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        callback();
    }, [isFetching]);

    function handleScroll() {
        // Check if the Window object’s inner height, plus the Document object’s
        // scrollTop, is equal to the Document’s offsetHeight
        if (
            window.innerHeight + document.documentElement.scrollTop !==
                document.documentElement.offsetHeight ||
            isFetching
        )
            return;

        setIsFetching(true);
    }

    return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
