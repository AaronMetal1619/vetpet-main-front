import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SocialLoginHandler() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [params, navigate]);

  return <p>Iniciando sesión...</p>;
}
