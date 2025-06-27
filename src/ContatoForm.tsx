import { useState } from 'react';
import { supabase } from './lib/supabase';
import { Link } from 'react-router-dom';

export function ContatoForm() {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [celular, setCelular] = useState('');
  const [cepResidencia, setCepResidencia] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMensagem(null);

    const { error } = await supabase.from('Contatos').insert([
      {
        nome_completo: nomeCompleto,
        celular,
        cep_residencia: cepResidencia,
        email,
        linkedin,
        cadastro_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      setMensagem(`Erro: ${error.message}`);
    } else {
      setMensagem('Contato cadastrado com sucesso!');
      setNomeCompleto('');
      setCelular('');
      setCepResidencia('');
      setEmail('');
      setLinkedin('');
    }
    setLoading(false);
  }

  return (
    <div style={pageStyle}>
      <div style={containerWrapperStyle}>
        <Link to="/" style={voltarStyle}>
          ← Voltar para Home
        </Link>

        <form onSubmit={handleSubmit} style={formStyle}>
          <h2 style={titleStyle}>Cadastro de Associação</h2>

          <label style={labelStyle}>
            Nome Completo
            <input
              type="text"
              value={nomeCompleto}
              onChange={(e) => setNomeCompleto(e.target.value)}
              required
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Celular
            <input
              type="text"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            CEP da Residência
            <input
              type="text"
              value={cepResidencia}
              onChange={(e) => setCepResidencia(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            LinkedIn
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              style={inputStyle}
            />
          </label>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Enviando...' : 'Salvar Contato'}
          </button>

          {mensagem && <p style={messageStyle}>{mensagem}</p>}
        </form>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: '#1C407D',
  padding: 20,
  boxSizing: 'border-box',
  fontFamily: 'Poppins, sans-serif',
  color: '#FFFFFF',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const containerWrapperStyle: React.CSSProperties = {
  maxWidth: 900,
  margin: '40px auto',
  padding: 24,
  backgroundColor: '#1C407D',
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
};

const voltarStyle: React.CSSProperties = {
  display: 'inline-block',
  marginBottom: 20,
  color: '#0096FA',
  fontWeight: 600,
  textDecoration: 'none',
  cursor: 'pointer',
  fontSize: 16,
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const titleStyle: React.CSSProperties = {
  marginBottom: 20,
  fontWeight: 700,
  fontSize: 24,
  color: '#FFFFFF',
  textAlign: 'center',
};

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  fontWeight: 600,
  color: '#F5D010',
  fontSize: 16,
};

const inputStyle: React.CSSProperties = {
  marginTop: 4,
  padding: 10,
  borderRadius: 8,
  border: '1px solid #BCBEC0',
  fontSize: 14,
  fontFamily: 'Poppins, sans-serif',
  backgroundColor: '#FFFFFF',
  color: '#000000',
};

const buttonStyle: React.CSSProperties = {
  marginTop: 20,
  backgroundColor: '#0096FA',
  color: '#FFFFFF',
  padding: '12px 24px',
  borderRadius: 8,
  fontSize: 16,
  border: 'none',
  cursor: 'pointer',
  fontWeight: 700,
  minWidth: 160,
};

const messageStyle: React.CSSProperties = {
  marginTop: 12,
  fontSize: 14,
  fontWeight: 600,
  color: '#F5D010',
};
