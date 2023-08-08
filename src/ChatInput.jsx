import React, { useState } from "react";

const ChatInput = ({ sendMessage }) => {
    const [message, setMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);

    const handleRecord = () => {
        // Implement recording functionality
        // Send recorded audio to the Whisper OpenAI API
        // Retrieve transcribed text from API response
        // Use sendMessage function to display transcribed text as a user message in the chat
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage(message.trim());
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                {message.trim() === "" ? (
                    <button onClick={handleRecord}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 18h6V6H9v12zm-4 0H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1M15 3v2a2 2 0 0 1-2 2H5v10h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h2v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2" />
                        </svg>
                    </button>
                ) : (
                    <button type="submit">Send</button>
                )}
            </div>
            <textarea
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        if (message.trim()) {
                            e.preventDefault();
                            sendMessage(message.trim());
                            setMessage("");
                        }
                    }
                }}
                placeholder="Type your message..."
                required
                aria-label="Type your message..."
            />
        </form>
    );
};

export default ChatInput;