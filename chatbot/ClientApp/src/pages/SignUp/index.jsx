import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importe useNavigate
import "./signup.css";
import axios from "axios";
import { FiUserPlus } from "react-icons/fi";
import { CgKeyhole } from "react-icons/cg";
import { useEffect } from "react";


const api = new axios.create({
  baseURL: "https://aiready.azurewebsites.net",
});

export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Obtenha a função de navegação

  useEffect(() => {
    console.log("Dados do usuário registrado:", user);
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/users/", {
        email,
        password,
      });

      const userData = await response.data;
      setUser(userData);
      localStorage.setItem("userSignUp", JSON.stringify(user));

      alert("Parabéns, você criou sua conta!");
      navigate("/");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
  
        if (status === 400) {
          if (data.detail === "Email already registered") {
            alert("Erro ao criar conta: Este e-mail já está registrado");
          } else {
            alert("Erro ao criar conta: Requisição inválida");
          }
        } else if (status === 422) {
          alert("Erro ao criar conta: Erro de validação");
          console.log("Detalhes do erro de validação:", data.detail);
        } else {
          console.log("Erro sem resposta do servidor:", error.message);
          alert("Erro ao criar conta. Tente novamente mais tarde.");
        }
      } else {
        console.log("Erro sem resposta do servidor:", error.message);
        alert("Erro ao criar conta. Tente novamente mais tarde.");
      }
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

