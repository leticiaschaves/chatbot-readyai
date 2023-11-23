import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";


const api = axios.create({
  baseURL: "https://aiready.azurewebsites.net",
});

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Envia uma solicitação de login com email e senha
      await api.get("/users/", {
        email,
        password,
      });

      alert("Login bem-sucedido!");
      navigate("/chatbot"); // Redireciona para a página de Chatbot após um login bem-sucedido
    } catch (error) {
      alert("Erro no login. Verifique seu email e senha e tente novamente.");
      navigate("/chatbot"); // Redireciona pro chatbot de ser errado tbm pq ta com problema do cors
    }

    setLoading(false);
  };

  const handleSignUp = () => {
    navigate("/signup"); // Redireciona para a página de SignUp quando o botão de registro é clicado
  };

  return (
    <main className="main-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h3>Login</h3>
        <div className="emailLabel">
          <label>
            <FaRegUserCircle className="iconLabel" />
            <input
              type="email"
              className="inputLabel"
              required
              value={email}
              placeholder="Digite seu e-mail"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </label>
        </div>
        <div className="passwordLabel">
          <label>
            <RiLockPasswordFill className="iconLabel" />
            <input
              type="password"
              placeholder="Digite sua senha"
              className="passwordLabel"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </label>
        </div>
        <button className="loginBtn" type="submit" disabled={loading}>
          Entrar
        </button>
        <div className="create-container">
          <a className="createAcc" type="button" onClick={handleSignUp}>
            Ainda não criou sua conta?
          </a>
        </div>
      </form>
    </main>
  );
};

