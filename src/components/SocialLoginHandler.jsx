// SocialLoginHandler.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function SocialLoginHandler() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // opcional: obtener user info con /api/me y setear estado
      axios.get('https://vetpet-sandbox-1.onrender.com/api/me', { headers: { Authorization: `Bearer ${token}` }})
        .then(r => {
          localStorage.setItem('userLocal', JSON.stringify(r.data));
        })
        .finally(() => navigate('/'));
    } else {
      navigate('/login');
    }
  }, [params, navigate]);

  return <p>Iniciando sesión...</p>;
}
