import { useState } from "react";
import "./signup.css";
import axios from "axios";

const api = new axios.create({
  baseURL: "https://aiready.azurewebsites.net",
});

export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Criando uma função de enviar async, pois ela pode demorar
  // a executar (por causa de uma requisição externa)
  const handleSubmit = async (event) => {
    // Previnir que a página recarregue
    event.preventDefault();

    // Fazendo a requisição e pondo "await" pois é ela
    // que vai demorar
    setLoading(true);

    try {
      await api.post("/users", {
        email,
        password,
      });

      alert("Parabéns, você criou sua conta");
    } catch (e) {
      //
    }

    setLoading(false);
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
      </form>
    </main>
  );
};
