import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./chat.header.cmp";
import MessageInput from "./message.input.cmp";
import MessageSkeleton from "./skeletons/message.skeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/format.message.time.lib";

const ChatContainer = () => {

    const { messages, getMessages, isMessagesLoading, selectedUser, 
            subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();
        
        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {

        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                    >
                        <div className=" chat-image avatar">
                            <div className="size-8 rounded-full border">
                                <img
                                    src={
                                        message.senderId === authUser._id
                                        ? authUser.profilePic || "/avatar.png"
                                        : selectedUser.profilePic || "/avatar.png"
                                    }
                                    alt="profile picture"
                                />
                            </div>
                        </div>
                        <div className="chat-header">
                            <time className="text-xs opacity-50">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col rounded-xs">
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="max-w-[300px]"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}

                <div ref={messageEndRef} />
            </div>

            <MessageInput />
        </div>
    );
}

export default ChatContainer;