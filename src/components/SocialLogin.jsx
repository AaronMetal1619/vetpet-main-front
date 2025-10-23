import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, facebookProvider, microsoftProvider } from '../firebase';
import axios from 'axios';

async function sendTokenToBackend(idToken) {
  // endpoint que validará el idToken con Firebase Admin
  const res = await axios.post('https://vetpet-sandbox-1.onrender.com/api/auth/firebase', { idToken });
  return res.data; // { token: 'YOUR_APP_TOKEN', user: {...} }
}


export default function SocialLogin({ onLogin }) {
  const handleProvider = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Envía el idToken (Firebase) al backend para verificar y crear sesión
      const data = await sendTokenToBackend(idToken);

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("userLocal", JSON.stringify(data.user));
        if (onLogin) onLogin(data.user);
      } else {
        // Fallback: guarda info mínima del user de Firebase
        localStorage.setItem("userLocal", JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          avatar: user.photoURL
        }));
        if (onLogin) onLogin({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          avatar: user.photoURL
        });
      }
    } catch (err) {
      console.error("Social login error:", err);
      // Mensajes amigables al usuario
      if (err?.code === "auth/popup-closed-by-user") {
        alert("Has cerrado la ventana de autenticación.");
      } else {
        alert("Error al iniciar sesión con proveedor. Revisa la consola.");
      }
    }
  };
  
  return (
    <div className="d-grid gap-2">
      <button className="btn btn-outline-danger" onClick={() => handleProvider(googleProvider)}>
        <i className="bi bi-google"></i> Iniciar con Google
      </button>

      <button className="btn btn-outline-primary" onClick={() => handleProvider(facebookProvider)}>
        <i className="bi bi-facebook"></i> Iniciar con Facebook
      </button>

      <button className="btn btn-outline-dark" onClick={() => handleProvider(microsoftProvider)}>
        <i className="bi bi-microsoft"></i> Iniciar con Microsoft
      </button>
    </div>
  );
}
