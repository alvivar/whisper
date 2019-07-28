import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo-hooks";

import useKeyPress from "../hooks/useKeyPress";
import useDebounce from "../hooks/useDebounce";

const POST_MUTATION = gql`
    mutation createDraft($content: String!, $channel: String!, $userId: ID!) {
        createDraft(content: $content, channel: $channel, userId: $userId) {
            id
        }
    }
`;

const SET_USER_NAME_MUTATION = gql`
    mutation setUserName($userId: ID!, $name: String!) {
        setUserName(userId: $userId, name: $name) {
            id
            name
        }
    }
`;

const CreatePost = ({ userId, userName, channel, setChannel }) => {
    const createPostMutation = useMutation(POST_MUTATION);
    const setUserNameMutation = useMutation(SET_USER_NAME_MUTATION);

    const [name, setName] = useState(userName);
    const debouncedName = useDebounce(name, 1000);

    const nameBgOk = "bg-blue-100 focus:bg-blue-200";
    const nameBgError = "bg-red-300 focus:bg-red-400";
    const [nameBg, setNameBg] = useState(nameBgOk);

    const textAreaBgOk = "bg-blue-100 focus:bg-blue-200";
    const textAreaBgError = "bg-red-300 focus:bg-red-400";
    const [textAreaBg, setTextAreaBg] = useState(textAreaBgOk);
    const [textArea, setTextArea] = useState();

    const [contentLetters, setContentLetters] = useState(0);
    const [contentWords, setContentWords] = useState(0);
    const [content, setContent] = useState("");

    const [channelB, setChannelB] = useState(channel);
    const deboundedChannel = useDebounce(channelB, 1000);

    const ctrlKeyDown = useKeyPress("Control");
    const enterKeyDown = useKeyPress("Enter");

    const createPost = async (userId, channel, content) => {
        if (content.trim() < 1) {
            textArea.focus();
            setTextAreaBg(textAreaBgError);
            console.log("Can't create an empty post");
            return false;
        }

        await createPostMutation({
            variables: {
                userId: userId,
                channel: channel.trim(),
                content: content.trim()
            }
        });

        console.log("Post created");
        setContent("");
        textArea.focus();
    };

    useEffect(() => {
        console.log("Trimming name");
        if (!name.trim()) {
            setName(userName);
            setNameBg(nameBgOk);
        }
    }, [name, userName]);

    useEffect(() => {
        setContentLetters(content.trim().length);
        setContentWords((content.trim().match(/\S+/g) || []).length);
        setTextAreaBg(textAreaBgOk);
    }, [content]);

    useEffect(() => {
        console.log("Name modified");
        if (debouncedName && debouncedName !== userName) {
            const setUserName = async () => {
                try {
                    await setUserNameMutation({
                        variables: {
                            userId: userId,
                            name: debouncedName
                        }
                    });

                    setNameBg(nameBgOk);
                    console.log("Name saved");
                } catch (error) {
                    setNameBg(nameBgError);
                    console.log("Name error, already in db");
                }
            };

            setUserName();
        }
    }, [debouncedName]);

    useEffect(() => {
        console.log(`Extracting channel from ${name}`);
        if (name.includes("@")) {
            setChannelB(name.split("@")[1]);
        } else {
            setChannelB(name);
        }
    }, [name]);

    useEffect(() => {
        console.log("Channel modified");
        if (deboundedChannel && deboundedChannel !== channel) {
            console.log("Saving new channel");
            setChannel(deboundedChannel);
        }
    }, [deboundedChannel]);

    useEffect(() => {
        console.log("Detecting Ctrl + Enter");
        if (ctrlKeyDown && enterKeyDown) {
            console.log("Ctrl + Enter pressed");
            createPost(userId, channel, content);
        }
    }, [ctrlKeyDown, enterKeyDown]);

    return (
        <div className="flex flex-wrap">
            <input
                className={`float-right w-full p-1 my-2 text-gray-600 focus:text-gray-800 ${nameBg} border-transparent outline-none rounded-lg`}
                onChange={e => setName(e.target.value)}
                value={name}
            />
            <textarea
                ref={node => setTextArea(node)}
                className={`w-full h-32 py-4 px-4 text-gray-800 ${textAreaBg} border border-transparent outline-none rounded-lg`}
                onChange={e => setContent(e.target.value)}
                value={content}
            />
            <div className="w-full">
                <button
                    onClick={e => {
                        if (userId) createPost(userId, channel, content);
                    }}
                    className="float-right h-16 my-2 py-2 px-4 text-sm text-gray-500 hover:text-white outline-none bg-blue-100 hover:bg-blue-400 border-transparent rounded-lg"
                >
                    <span className="text-xl">whisper</span>{" "}
                    <span className="text-xs">ctrl + enter</span>
                </button>

                <button className="float-right h-16 mr-2 my-2 py-2 px-2 text-sm text-gray-400 outline-none bg-gray-100 border-transparent rounded-lg">
                    {`${contentLetters} Letters`}
                    <br />
                    {`${contentWords} Words`}
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
