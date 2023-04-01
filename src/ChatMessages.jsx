import React from "react";
import ReactMarkdown from "react-markdown";

const ChatMessages = ({ messages }) => {
    return (
        <div
            className="chat-messages"
            role="region"
            aria-label="Chat"
            aria-live="polite"
            aria-atomic="false"
        >
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`chat-message ${
                        message.sender === "user"
                            ? "user-message"
                            : "ai-message"
                    }`}
                >
                    <h2>{message.sender}</h2>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
            ))}
        </div>
    );
};

export default ChatMessages;
