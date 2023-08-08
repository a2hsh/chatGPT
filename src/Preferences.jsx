import React, { useState, useEffect } from "react";
import { Form, FormGroup, Label, Button } from 'react-bootstrap';

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
        <div>
            {showSettings && (
                <div className="settings">
                    <h2>Settings</h2>
                    <label htmlFor="api-key-input">API Key:</label>
                    {renderInput("apiKey")}
                    <label htmlFor="prompt-textarea">Prompt:</label>
                    <textarea
                        value={settings.prompt}
                        onChange={(event) => handleInputChange(event, "prompt")}
                        disabled={!settings.included.prompt}
                        aria-label="prompt"
                    />
                    <label htmlFor="model-selector">Select Model:</label>
                    <select
                        value={settings.selectedModel}
                        onChange={(event) =>
                            handleInputChange(event, "selectedModel")
                        }
                    >
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="gpt-3.5">GPT-3.5</option>
                        <option value="gpt-4">GPT-4</option>
                        {/* Add other models here as necessary */}
                    </select>
                    <label htmlFor="max-tokens-input">Max Tokens:</label>
                    {renderInput("maxTokens", "text", "[0-9]*")}
                    {renderCheckbox("maxTokens")}
                    <label htmlFor="temperature-input">Temperature:</label>
                    {renderInput("temperature", "number")}
                    {renderCheckbox("temperature")}
                    <label htmlFor="top-p-input">Top P:</label>
                    {renderInput("topP", "number")}
                    {renderCheckbox("topP")}
                    <label htmlFor="frequency-penalty-input">
                        Frequency Penalty:
                    </label>
                    {renderInput("frequencyPenalty", "number")}
                    {renderCheckbox("frequencyPenalty")}
                    <label htmlFor="presence-penalty-input">
                        Presence Penalty:
                    </label>
                    {renderInput("presencePenalty", "number")}
                    {renderCheckbox("presencePenalty")}
                    <label htmlFor="n-input">N:</label>
                    {renderInput("n", "number")}
                    {renderCheckbox("n")}
                    <label htmlFor="stream-input">Stream</label>
                    {renderInput("stream", "checkbox")}
                    {renderCheckbox("stream")}
                    <button
                        onClick={handleSaveSettings}
                        disabled={!settings.apiKey || !settings.prompt}
                    >
                        Save Settings
                    </button>
                    <Form role="form" aria-label="Chat settings">
    return (
        <Form role="form" aria-label="Chat settings">
            {showSettings && (
                <div>
                    <h2>Settings</h2>
                    <FormGroup>
                        <Label htmlFor="api-key-input">API Key:</Label>
                        {renderInput("apiKey")}
                    </FormGroup>
                    ...
                    <Button
                        onClick={handleSaveSettings}
                        disabled={!settings.apiKey || !settings.prompt}
                    >
                        Save Settings
                    </Button>
                    ...
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