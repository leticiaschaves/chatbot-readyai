import firebase from "firebase/app";
import "firebase/storage"; // Importe o módulo de armazenamento do Firebase, caso vá salvar arquivos.

const firebaseConfig = {
    apiKey: "AIzaSyB6NCKB6ntCjkDWOfBFKyGeF7i47qPgyzo",
    authDomain: "chatbot-readyai.firebaseapp.com",
    projectId: "chatbot-readyai",
    storageBucket: "chatbot-readyai.appspot.com",
    messagingSenderId: "233488655223",
    appId: "1:233488655223:web:ec9192ba3ca2220dc3b772",
    measurementId: "G-B9XMEJHTSP"
};

// Inicialize o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage(); // Obtenha uma referência ao serviço de armazenamento do Firebase

export { storage, firebase as default };