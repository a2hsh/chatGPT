import React from "react";
import ReactMarkdown from "react-markdown";

const ChatMessages = ({ messages }) => {
    const saveChatLog = function () {
        //save chat log to txt file with markdown syntax, encluding the date and time
        //get date and time
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayName = date.toDateString();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        //create file name
        const fileName = `chatTranscript-${year}-${month}-${day}_${hour}-${minutes}-${seconds}.txt`;

        //create file content
        //in the file content, get formatted date and time
        let fileContent = `# Chat GPT Transcript ffor ${dayName}, ${hour}:${minutes}:${seconds}\n\n`;
        //add prompt
        fileContent += `## Prompt\n`;
        fileContent += `${
            JSON.parse(localStorage.getItem("settings")).prompt
        }\n\n`;
        messages.forEach((message) => {
            fileContent += `## ${message.sender}\n`;
            fileContent += `${message.content}\n`;
        });

        //create a blob and download it
        const blob = new Blob([fileContent], { type: "text/plain" });
        const link = document.createElement("a");
        link.download = fileName;
        link.href = URL.createObjectURL(blob);
        link.click();
        //remove the link
        link.remove();
    };

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
            {message.audio && (
                <div>
                    <audio controls>
                        <source src={message.audio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                    {message.transcription && (
                        <p>{message.transcription}</p>
                    )}
                </div>
            )}
            <p>
                <ReactMarkdown>{message.content}</ReactMarkdown>
            </p>
            <button
                onClick={(e) => {
                    navigator.clipboard.writeText(message.content);
                    //change button text
                    e.target.innerText = `Copied ${message.sender}'s message!`;
                }}
            >
                Copy {message.sender} message
            </button>
        </div>
    ))}
            {messages.length > 0 && (
                <button
                    onClick={() => {
                        saveChatLog();
                    }}
                >
                    Save Chat Transcript
                </button>
            )}
        </div>
    );
};

export default ChatMessages;