import React, { useState } from "react";
//import audio recording hook
import useAudioRecorder from "./hooks/useAudioRecorder";

const ChatInput = ({ sendMessage }) => {
    const audioRecorder = useAudioRecorder();
    const [message, setMessage] = useState("");

    const handleRecord = () => {
        //record the audio in webm format. Use the MediaRecorder API.
        audioRecorder.start();
    };

    const handleSend = () => {
        //send the audio to the server
        audioRecorder.stop();
        //get the data as webm
        const audioFile = audioRecorder.convertToWebM();
        ///play the data
        const audio = audioRecorder.convertToBlob();
        //audio.play();

        //reset the recorder
        audioRecorder.reset();
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
            {audioRecorder.isRecording ? (
                <div>
                    <button
                        type="button"
                        onClick={() => {
                            if (audioRecorder.isPaused) audioRecorder.resume();
                            else audioRecorder.pause();
                        }}
                    >
                        {audioRecorder.isPaused ? "Resume" : "Pause"}
                    </button>
                    <button type="button" onClick={audioRecorder.reset}>
                        Cancel
                    </button>
                    {/* recording Duration */}
                    <p>{audioRecorder.duration} </p>
                    <button type="button" onClick={handleSend}>
                        Send
                    </button>
                </div>
            ) : (
                <React.Fragment>
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
                    {message.trim() ? (
                        <button type="submit">Send</button>
                    ) : (
                        <button type="button" onClick={handleRecord}>
                            Record
                        </button>
                    )}
                </React.Fragment>
            )}
        </form>
    );
};

export default ChatInput;
