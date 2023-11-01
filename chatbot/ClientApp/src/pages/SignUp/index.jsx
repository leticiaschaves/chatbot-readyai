import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importe useNavigate
import "./signup.css";
import axios from "axios";

const api = new axios.create({
  baseURL: "https://aiready.azurewebsites.net",
});

export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Obtenha a função de navegação

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/users", {
        email,
        password,
      });

      alert("Parabéns, você criou sua conta");
      navigate("/chatbot");
    } catch (e) {
      //
    }

    setLoading(false);
  };

  const handleLogIn = () => {
    navigate("/"); // Redirecione para a página inicial (Login) quando o botão de login é clicado
  };

  return (
    <main className="main-page">
      <form className="sign-up-form" onSubmit={handleSubmit}>
        <h3>Cadastre-se</h3>

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
          Criar conta
        </button>

        <p>Já tem uma conta?</p>

        <button type="button" onClick={handleLogIn}>
          Entrar
        </button>
      </form>
    </main>
  );
};

