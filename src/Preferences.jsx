import React, { useState, useEffect } from "react";
import { Form, FormGroup, FormLabel, Button } from "react-bootstrap";

const Preferences = ({ onShow, onHide, onSettingsChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        apiKey: "",
        prompt: "You are ChatGPT, a large language model developed by OpenAI. Answer as concisely as possible.",
        selectedModel: "gpt-3.5-turbo",
        maxTokens: 100,
        temperature: 0.9,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
        n: 1,
        stream: false,
        included: {
            apiKey: true,
            prompt: true,
            selectedModel: true,
            maxTokens: true,
            temperature: true,
            topP: true,
            frequencyPenalty: true,
            presencePenalty: true,
            n: true,
            stream: true,
        },
    });

    useEffect(() => {
        const storedSettings = localStorage.getItem("settings");

        if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
            setShowSettings(false);
        } else {
            if (onShow && typeof onShow === "function") {
                onShow();
            }
            setShowSettings(true);
        }
    }, []);

    const handleInputChange = (event, field) => {
        setSettings({ ...settings, [field]: event.target.value });
    };

    const handleCheckboxChange = (event, field) => {
        setSettings({
            ...settings,
            included: { ...settings.included, [field]: event.target.checked },
        });
    };

    const handleSaveSettings = () => {
        localStorage.setItem("settings", JSON.stringify(settings));
        setShowSettings(false);
        setIsEditing(false);
        if (onHide && typeof onHide === "function") {
            onHide();
        }
        onSettingsChange(settings);
    };

    const renderInput = (field, type = "text", pattern = null) => (
        <input
            type={type}
            value={settings[field]}
            onChange={(event) => handleInputChange(event, field)}
            disabled={!settings.included[field]}
            pattern={pattern}
            aria-label={field}
        />
    );

    const renderCheckbox = (field) => (
        <input
            type="checkbox"
            checked={settings.included[field]}
            onChange={(event) => handleCheckboxChange(event, field)}
            aria-label={`Include ${field} in request`}
        />
    );

    return (
        <Form role="form" aria-label="Chat settings">
            {showSettings && (
                <div className="settings">
                    <h2>Settings</h2>
                    {isEditing && (
                        <Button
                            type="button"
                            onClick={() => {
                                setShowSettings(false);
                                setIsEditing(false);
                                if (onHide && typeof onHide === "function") {
                                    onHide();
                                }
                            }}
                        >
                            Close
                        </Button>
                    )}
                    <FormGroup>
                        <FormLabel htmlFor="api-key-input">API Key:</FormLabel>
                        {renderInput("apiKey")}
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="prompt-textarea">Prompt:</FormLabel>
                        <textarea
                            value={settings.prompt}
                            onChange={(event) =>
                                handleInputChange(event, "prompt")
                            }
                            disabled={!settings.included.prompt}
                            aria-label="prompt"
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="model-selector">
                            Select Model:
                        </FormLabel>
                        <select
                            value={settings.selectedModel}
                            onChange={(event) =>
                                handleInputChange(event, "selectedModel")
                            }
                        >
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                            <option value="gpt-3.5-turbo-16k">
                                GPT-3.5 16K
                            </option>
                            <option value="gpt-3.5">GPT-3.5</option>
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-4-32k">GPT-4 32K</option>
                            {/* Add other models here as necessary */}
                        </select>
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="max-tokens-input">
                            Max Tokens:
                        </FormLabel>
                        {renderInput("maxTokens", "text", "[0-9]*")}
                        {renderCheckbox("maxTokens")}
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="temperature-input">
                            Temperature:
                        </FormLabel>
                        {renderInput("temperature", "number")}
                        {renderCheckbox("temperature")}
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="top-p-input">Top P:</FormLabel>
                        {renderInput("topP", "number")}
                        {renderCheckbox("topP")}
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="frequency-penalty-input">
                            Frequency Penalty:
                        </FormLabel>
                        {renderInput("frequencyPenalty", "number")}
                        {renderCheckbox("frequencyPenalty")}
                    </FormGroup>
                    <FormGroup>
                        <FormLabel htmlFor="presence-penalty-input">
                            Presence Penalty:
                        </FormLabel>
                        {renderInput("presencePenalty", "number")}
                        {renderCheckbox("presencePenalty")}
                    </FormGroup>
                    <Button
                        onClick={handleSaveSettings}
                        disabled={!settings.apiKey || !settings.prompt}
                    >
                        Save Settings
                    </Button>
                </div>
            )}
            {!showSettings && !isEditing && (
                <Button
                    type="button"
                    onClick={() => {
                        setIsEditing(true);
                        setShowSettings(true);
                        if (onShow && typeof onShow === "function") {
                            onShow();
                        }
                    }}
                >
                    Edit Preferences
                </Button>
            )}
        </Form>
    );
};

export default Preferences;
