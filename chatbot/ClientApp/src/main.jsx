import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'



//configurando router
import {
  createBrowserRouter,
  RouterProvider,
}
  from 'react-router-dom';
import Chatbot from './components/Chatbot.jsx';
import { LoginPage } from './pages/Login/index.jsx';
import { SignUpPage } from './pages/SignUp/index.jsx';

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />
    },

    {
    path: "Chatbot",
    element: <Chatbot />
  },

  {
    path: "SignUp",
    element: <SignUpPage />
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <RouterProvider router={router}/>
  </React.StrictMode>,
);
