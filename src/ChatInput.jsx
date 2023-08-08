import React, { useState } from "react";

const ChatInput = ({ sendMessage }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage(message.trim());
            setMessage("");
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
            {message === "" ? (
                <button type="button" onClick={startRecording} aria-label="Start recording">
                    <i className="fas fa-microphone"></i>
                </button>
            ) : (
                <button type="submit">Send</button>
            )}
            {isRecording && (
                <>
                    <button type="button" onClick={pauseRecording} aria-label="Pause recording">
                        <i className="fas fa-pause"></i>
                    </button>
                    <button type="button" onClick={cancelRecording} aria-label="Cancel recording">
                        <i className="fas fa-times"></i>
                    </button>
                    <button type="button" onClick={sendRecording} aria-label="Send recording">
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </>
            )}
        </form>
    );
};

export default ChatInput;