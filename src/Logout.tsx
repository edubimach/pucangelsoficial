import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

export function Logout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function doSignOut() {
      await signOut();
      navigate('/', { replace: true }); // Redireciona para a tela de login
    }
    doSignOut();
  }, [signOut, navigate]);

  return (
    <div style={logoutContainer}>
      <p>Saindo...</p>
    </div>
  );
}

const logoutContainer: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Poppins, sans-serif',
  fontSize: 18,
  color: '#FFFFFF', // branco para contraste no fundo azul
};
