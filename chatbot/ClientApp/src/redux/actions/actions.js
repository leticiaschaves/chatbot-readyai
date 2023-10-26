// actions.js
import { REQUEST_START, REQUEST_SUCCESS, REQUEST_FAILURE } from "./action.types";

const requestStart = () => ({
    type: REQUEST_START,
});

const requestSuccess = (response) => ({
    type: REQUEST_SUCCESS,
    payload: response,
});

const requestFailure = (error) => ({
    type: REQUEST_FAILURE,
    payload: error,
});

export const addMessage = (text, type) => ({
    type: type === "user" ? SEND_MESSAGE : RECEIVE_MESSAGE,
    payload: text,
});

export const fetchOpenAIResponse = async (prompt, chats) => {
    const apiKey = import.meta.env.VITE_OPENAIAPIKEY;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
    };  

    const requestBody = JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{role:"system",content:"you are an objective brazilian assistant helper"},...chats.map(c => ({ role: c.sender === "me" ? "user" : "assistant", content: c.message })), { role: "system", content: prompt }],
        max_tokens: 200,
    });

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: requestBody,
    });
    if (response.status !== 200) throw new Error("deu erro")
    return response.json()


};