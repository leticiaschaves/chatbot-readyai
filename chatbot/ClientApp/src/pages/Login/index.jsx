import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";

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
      await api.post("/login", {
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
        <h3>Entrar</h3>

        <div>
          <label>
            E-mail:
            <input
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </label>
        </div>

        <div>
          <label>
            Senha:
            <input
              type="password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          Entrar
        </button>

        <p>Ainda não criou sua conta?</p>

        <button type="button" onClick={handleSignUp}>
          Criar conta
        </button>
      </form>
    </main>
  );
};

