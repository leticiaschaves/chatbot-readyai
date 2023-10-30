import { useState } from "react";
import "./login.css";
import axios from "axios";

const api = axios.create({
  baseURL: "https://aiready.azurewebsites.net",
});

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Envia uma solicitação de login com email e senha
      await api.post("/login", {
        email,
        password,
      });

      alert("Login bem-sucedido!");
    } catch (error) {
      alert("Erro no login. Verifique seu email e senha e tente novamente.");
    }

    setLoading(false);
  };

  return (
    <main className="main-page">
      <form className="login-form" onSubmit={handleSubmit}>
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

        {/* <div>
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
        </div> */}

        <button type="submit" disabled={loading}>
          Entrar
        </button>
      </form>
    </main>
  );
};