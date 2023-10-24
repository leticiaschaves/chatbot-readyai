import { SEND_MESSAGE, RECEIVE_MESSAGE } from '../actions/action.types'

const initialState = {
  messages: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SEND_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, { text: action.payload, type: "user" }],
      };
    case RECEIVE_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, { text: action.payload, type: "bot" }],
      };
    default:
      return state;
  }
}