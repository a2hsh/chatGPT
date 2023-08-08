import React, { useState } from "react";

const ChatInput = ({ sendMessage }) => {
    const [message, setMessage] = useState("");
    const [recording, setRecording] = useState(false);

    const handleStartRecording = () => {
        // Start recording audio
        setRecording(true);
    };

    const handlePauseRecording = () => {
        // Pause recording audio
    };

    const handleCancelRecording = () => {
        // Cancel recording audio
        setRecording(false);
    };

    const handleSendRecording = () => {
        // Send recorded audio to Whisper API
        setRecording(false);
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
                    <button type="button" onClick={handleStartRecording}>
                        <i className="fas fa-microphone"></i>
                    </button>
                ) : (
                    <>
                        <button type="button" onClick={handlePauseRecording}>
                            <i className="fas fa-pause"></i>
                        </button>
                        <button type="button" onClick={handleCancelRecording}>
                            <i className="fas fa-times"></i>
                        </button>
                        <button type="button" onClick={handleSendRecording}>
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </>
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
            <button type="submit">Send</button>
        </form>
    );
};

export default ChatInput;