import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import logo from './assets/logos.jpg';

export function Home() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
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

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#1C407D', // fundo azul escuro em toda a tela
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
  backgroundColor: '#F5D010', // amarelo vivo
  border: 'none',
  padding: '14px 32px',
  color: '#1C407D', // azul escuro no texto
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
