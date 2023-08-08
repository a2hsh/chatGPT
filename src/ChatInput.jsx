import React, { useState } from "react";

const ChatInput = ({ sendMessage }) => {
    const [message, setMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage(message.trim());
            setMessage("");
        }
    };

    const handleMicrophoneClick = () => {
        // Implement recording functionality here
    };

    return (
        <form onSubmit={handleSubmit}>
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
            {isRecording ? (
                <div>Microphone icon</div>
            ) : (
                <button type="button" onClick={handleMicrophoneClick}>
                    Microphone icon
                </button>
            )}
            <button type="submit">Send</button>
        </form>
    );
};

export default ChatInput;