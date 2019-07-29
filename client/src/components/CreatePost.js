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

const CreatePost = ({ user, setUser, channel, setChannel }) => {
    const createPostMutation = useMutation(POST_MUTATION);
    const setUserNameMutation = useMutation(SET_USER_NAME_MUTATION);

    const [name, setName] = useState(user.name);
    const debouncedName = useDebounce(name, 1000);

    const inputBgOk = "bg-blue-100 focus:bg-blue-200";
    const inputBgError = "bg-red-300 focus:bg-red-400";
    const [inputBg, setInputBg] = useState(inputBgOk);

    const textAreaBgOk = "bg-blue-100 focus:bg-blue-200";
    const textAreaBgError = "bg-red-300 focus:bg-red-400";
    const [textAreaBg, setTextAreaBg] = useState(textAreaBgOk);
    const [textArea, setTextArea] = useState();

    const [contentWords, setContentWords] = useState(0);
    const [contentLetters, setContentLetters] = useState(0);
    const [content, setContent] = useState("");

    const [channelToDebounce, setChannelToDebounce] = useState(channel);
    const deboundedChannel = useDebounce(channelToDebounce, 1000);

    const ctrlKeyDown = useKeyPress("Control");
    const enterKeyDown = useKeyPress("Enter");

    const createPost = async (userId, channel, content) => {
        if (!content.trim()) {
            textArea.focus();
            setTextAreaBg(textAreaBgError);
            console.log("Can't create an empty post");
            return false;
        }

        await createPostMutation({
            variables: {
                userId: user.id,
                channel: channel.trim(),
                content: content.trim()
            }
        });

        setContent("");
        textArea.focus();
        console.log("Post created");
    };

    useEffect(() => {
        console.log("Trimming name");
        if (!name.trim()) {
            setName(user.name);
            setInputBg(inputBgOk);
        }
    }, [name, user.name]);

    useEffect(() => {
        setContentWords((content.trim().match(/\S+/g) || []).length);
        setContentLetters(content.trim().length);
        setTextAreaBg(textAreaBgOk);
    }, [content]);

    useEffect(() => {
        console.log("Name modified");
        if (debouncedName && debouncedName !== user.name) {
            const setUserName = async () => {
                try {
                    await setUserNameMutation({
                        variables: {
                            userId: user.id,
                            name: debouncedName
                        }
                    });

                    await setUser({
                        id: user.id,
                        name: debouncedName,
                        sessionHash: user.sessionHash
                    });

                    setInputBg(inputBgOk);
                    console.log("Name saved");
                } catch (error) {
                    setInputBg(inputBgError);
                    console.log("Name error, already in db probably");
                }
            };

            setUserName();
        }
    }, [debouncedName]);

    useEffect(() => {
        console.log(`Extracting channel from ${name}`);
        if (name.includes("@")) {
            let channel = name.split("@")[1].trim() || "@";
            channel = channel ? channel : "@";
            setChannelToDebounce(channel);
        } else {
            setChannelToDebounce(name.trim());
        }
    }, [name]);

    useEffect(() => {
        console.log("Channel modified");
        if (deboundedChannel && deboundedChannel !== channel) {
            setChannel(deboundedChannel);
            console.log(`Saving new channel: ${deboundedChannel}`);
        }
    }, [deboundedChannel]);

    useEffect(() => {
        console.log("Detecting Ctrl + Enter");
        if (ctrlKeyDown && enterKeyDown) {
            console.log("Ctrl + Enter pressed");
            createPost(user.id, channel, content);
        }
    }, [ctrlKeyDown, enterKeyDown]);

    return (
        <div className="flex flex-wrap">
            <input
                className={`float-right w-full p-1 my-2 text-gray-600 focus:text-gray-800 ${inputBg} border-transparent outline-none rounded-lg`}
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
                        if (user.id) createPost(user.id, channel, content);
                    }}
                    className="float-right h-16 my-2 py-2 px-4 text-sm text-gray-500 hover:text-white outline-none bg-blue-100 hover:bg-blue-400 border-transparent rounded-lg"
                >
                    <span className="text-xl">whisper</span>{" "}
                    <span className="text-xs">ctrl + enter</span>
                </button>

                {contentLetters < 1 ? (
                    <span />
                ) : (
                    <button className="float-right h-16 mr-2 my-2 py-2 px-4 text-sm text-gray-400 outline-none bg-gray-100 border-transparent rounded-lg">
                        {`${contentWords} words`}
                        <br />
                        {`${contentLetters} letters`}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CreatePost;
