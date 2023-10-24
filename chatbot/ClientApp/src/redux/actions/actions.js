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

export const fetchOpenAIResponse = (prompt) => {
    return async (dispatch) => {
        try {
            dispatch(requestStart());

            const apiKey = 'YOUR_API_KEY';
            const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            };

            const requestBody = JSON.stringify({
                prompt: prompt,
                max_tokens: 50,
            });

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: headers,
                body: requestBody,
            });

            if (!response.ok) {
                throw new Error('Request failed');
            }

            const data = await response.json();
            dispatch(requestSuccess(data.choices[0].text.trim()));
            dispatch(addMessage(data.choices[0].text.trim(), "bot"));
        } catch (error) {
            dispatch(requestFailure(error));
        }
    };
};