// Taken from here
// https://usehooks.com/useKeyPress/

import { useState, useEffect } from "react";

const useKeyPress = targetKey => {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);

    useEffect(() => {
        // If pressed key is our target key then set to true
        const downHandler = ({ key }) => {
            if (key === targetKey) setKeyPressed(true);
        };

        // If released key is our target key then set to false
        const upHandler = ({ key }) => {
            if (key === targetKey) setKeyPressed(false);
        };

        // Add event listeners
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, [targetKey]); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
};

export default useKeyPress;
