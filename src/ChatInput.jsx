import React, { useState } from "react";

const ChatInput = ({ sendMessage }) => {
    const [message, setMessage] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        setIsRecording(true);

        const audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            setRecording(audio);
        });

        setMediaRecorder(mediaRecorder);
    };

    const pauseRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.pause();
            setIsRecording(false);
        }
    };

    const cancelRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
            setRecording(null);
        }
    };

    const sendRecording = async () => {
        if (recording) {
            // Send the recording to the Whisper OpenAI API for conversion to text
            // This is a placeholder and needs to be replaced with the actual API call
            const response = await fetch("https://api.openai.com/v1/whisper", {
                method: "POST",
                body: recording,
            });
            const data = await response.json();
            const text = data.text;

            // Send the converted text as a message
            sendMessage(text);
            setIsRecording(false);
            setRecording(null);
        }
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