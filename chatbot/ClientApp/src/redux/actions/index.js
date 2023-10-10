import { SEND_MESSAGE, RECEIVE_MESSAGE } from "./action.types";

export const sendMessage = (message) => ({
  type: SEND_MESSAGE,
  payload: message,
});

export const receiveMessage = (message) => ({
  type: RECEIVE_MESSAGE,
  payload: message,
});