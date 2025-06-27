// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ContatoForm } from './ContatoForm';
import { ConsultaContatos } from './ConsultaContatos';
import { AuthProvider, useAuth } from './AuthProvider';
import { PrivateRoute } from './PrivateRoute';
import { Logout } from './Logout';
import logo from './assets/logos.jpg';

function Home() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  return (
    <div style={pageStyle}>
      <img src={logo} alt="PUC Angels" style={logoStyle} />

      {!user ? (
        <>
          <p style={textStyle}>Faça login com sua conta Google para continuar</p>
          <button style={buttonStyle} onClick={signInWithGoogle}>
            Entrar com Google
          </button>
        </>
      ) : (
        <>
          <p style={textStyle}>Olá, {user.email}</p>
          <div style={buttonGroupStyle}>
            <Link to="/cadastro" style={buttonLinkStyle}>
              Cadastro
            </Link>
            <Link to="/consulta" style={buttonLinkStyle}>
              Consulta
            </Link>
          </div>
          <button style={{ ...buttonStyle, marginTop: 20 }} onClick={handleSignOut}>
            Sair
          </button>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<ContatoForm />} />
          <Route
            path="/consulta"
            element={
              <PrivateRoute>
                <ConsultaContatos />
              </PrivateRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Estilos
const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#1C407D', // azul escuro
  padding: 24,
  boxSizing: 'border-box',
  fontFamily: 'Poppins, sans-serif',
  color: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 24,
};

const logoStyle: React.CSSProperties = {
  maxWidth: 180,
};

const textStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  textAlign: 'center',
  margin: 0,
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#F5D010', // amarelo
  border: 'none',
  padding: '14px 32px',
  color: '#1C407D', // azul escuro texto
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: 16,
  minWidth: 200,
  transition: 'background-color 0.3s ease',
};

const buttonGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: 16,
};

const buttonLinkStyle: React.CSSProperties = {
  ...buttonStyle,
  textDecoration: 'none',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
};
