import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importe useNavigate
import "./signup.css";
import axios from "axios";
import { FiUserPlus } from "react-icons/fi";
import { CgKeyhole } from "react-icons/cg";


const api = new axios.create({
  baseURL: "https://aiready.azurewebsites.net",
});

export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Obtenha a função de navegação

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post("/users/", {
        email,
        password,
      });

      alert("Parabéns, você criou sua conta");
      navigate("/");
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
            <FiUserPlus className="iconLabel" />
            <input
              type="email"
              required
              value={email}
              placeholder="Digite seu e-mail"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </label>
        </div>
        <div>
          <label>
            <CgKeyhole className="iconLabel" />
            <input
              type="password"
              required
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </label>
        </div>
        <div>
          <label>
            <CgKeyhole className="iconLabel" />
            <input
              type="password"
              required
              value={confirmPassword}
              placeholder="Confirme sua senha"
              onChange={(event) => {
                setconfirmPassword(event.target.value);
              }}
            />
          </label>
        </div>
        <button className="signupBtn" type="submit" disabled={loading}>
          Criar conta
        </button>
        <div className="login-container">
          <a className="loginAcc" type="button" onClick={handleLogIn}>
            Já tem uma conta?
          </a>
        </div>
      </form>
    </main>
  );
};

