import React, { useState, useEffect } from "react";
import { Container } from 'react-bootstrap';
import Preferences from "./Preferences";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import "./App.css";

const App = () => {
    const [canChat, setCanChat] = useState(true);
    const [settings, setSettings] = useState(
        JSON.parse(localStorage.getItem("settings")) || null
    );
    const [messages, setMessages] = useState([]);
    const [isApiTyping, setIsApiTyping] = useState(false);

    useEffect(() => {
        if (settings) {
            localStorage.setItem("settings", JSON.stringify(settings));
        }
    }, [settings]);

    const sendMessage = async (userMessage) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "user", content: userMessage },
        ]);

        setIsApiTyping(true);

        try {
            const conversationMessages = [
                {
                    role: "system",
                    content: settings.included.prompt ? settings.prompt : "",
                },
                ...messages.map((message) => ({
                    role: message.sender,
                    content: message.content,
                })),
                { role: "user", content: userMessage },
            ];

            const requestOptions = {
                model: settings.selectedModel,
                messages: conversationMessages,
            };

            if (settings.included.maxTokens) {
                requestOptions.max_tokens = +settings.maxTokens;
            }
            if (settings.included.temperature) {
                requestOptions.temperature = settings.temperature;
            }
            if (settings.included.topP) {
                requestOptions.top_p = settings.topP;
            }
            if (settings.included.frequencyPenalty) {
                requestOptions.frequency_penalty = settings.frequencyPenalty;
            }
            if (settings.included.presencePenalty) {
                requestOptions.presence_penalty = settings.presencePenalty;
            }
            if (settings.included.n) {
                requestOptions.n = +settings.n;
            }
            if (settings.included.stream) {
                requestOptions.stream = settings.stream;
            }

            const response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${settings.apiKey}`,
                    },
                    body: JSON.stringify(requestOptions),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            const aiResponse = data.choices[0].message.content.trim();

            setIsApiTyping(false);

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "assistant", content: aiResponse },
            ]);
        } catch (error) {
            setIsApiTyping(false);
            console.error("Error calling ChatGPT API:", error);
            // Handle the error, e.g., show an error message to the user
        }
    };

    const sendAudio = async (audio) => {
        // Send audio recording to Whisper API
    };

    const onSettingsChange = (newSettings) => {
        setSettings(newSettings);
    };

    const onSettingsShow = () => {
        // Hide the UI
        setCanChat(false);
    };

    const onSettingsHide = () => {
        // Show the UI
        setCanChat(true);
    };

    return (
            <Container>
                <Preferences
                    onShow={onSettingsShow}
                    onHide={onSettingsHide}
                    onSettingsChange={onSettingsChange}
                    role="form"
                    aria-label="Chat settings"
                />
                {canChat && settings && (
                    <>
                        <ChatMessages messages={messages} role="log" aria-label="Chat messages" />
                        <ChatInput sendMessage={sendMessage} sendAudio={sendAudio} role="textbox" aria-label="Chat input" />
                        <div
                            className="api-typing-status"
                            aria-live="polite"
                            aria-atomic="true"
                            role="status"
                        >
                            {isApiTyping ? "ChatGPT is typing..." : ""}
                        </div>
                    </>
                )}
            </Container>
        );
};
export default App;
            </Container>
        );
};
export default App;