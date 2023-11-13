// api.js
let chatHistory = [];

// Função para salvar uma conversa
export const saveChat = (chat) => {
  chatHistory.push(chat);
};

// Função para obter todas as conversas
export const getAllChats = () => {
  return chatHistory;
};
