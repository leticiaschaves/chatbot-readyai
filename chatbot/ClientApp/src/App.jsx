import "./App.css";
import { Provider } from "react-redux/es";
import store from "./redux/store";
import Chatbot from "./components/Chatbot";
import { SignUpPage } from "./pages/SignUp";
import { LoginPage } from "./pages/Login";

function App() {
  return (
    <Provider store={store}>
      <Chatbot />
      {/* <SignUpPage /> */}
      {/* <LoginPage /> */}
    </Provider>
  );
}

export default App;
