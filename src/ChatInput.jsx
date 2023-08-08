import React, { useState } from "react";

const ChatInput = ({ sendMessage }) => {
    const [message, setMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);

    const handleRecordClick = () => {
        setIsRecording(!isRecording);
    };

    const handleSendClick = () => {
        if (isRecording) {
            // Logic to send recorded audio
            // Call sendMessage function with recorded audio
        } else {
            if (message.trim()) {
                sendMessage(message.trim());
                setMessage("");
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRecording) {
            // Logic to send recorded audio
            // Call sendMessage function with recorded audio
        } else {
            if (message.trim()) {
                sendMessage(message.trim());
                setMessage("");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        if (isRecording) {
                            // Logic to send recorded audio
                            // Call sendMessage function with recorded audio
                        } else {
                            if (message.trim()) {
                                e.preventDefault();
                                sendMessage(message.trim());
                                setMessage("");
                            }
                        }
                    }
                }}
                placeholder="Type your message..."
                required
                aria-label="Type your message..."
            />
            {isRecording ? (
                <button type="button" onClick={handleRecordClick}>
                    Stop Recording
                </button>
            ) : (
                <button type="button" onClick={handleRecordClick}>
                    Start Recording
                </button>
            )}
            <button type="button" onClick={handleSendClick}>
                Send
            </button>
        </form>
    );
};

export default ChatInput;