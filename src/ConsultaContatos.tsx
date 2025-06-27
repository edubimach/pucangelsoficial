import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Link } from 'react-router-dom';

interface Contato {
  id: number;
  nome_completo: string | null;
  celular: string | null;
  cep_residencia: string | null;
  email: string | null;
  linkedin: string | null;
  cadastro_at: string | null;
  created_at: string;
}

export function ConsultaContatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  async function fetchContatos(page: number) {
    setLoading(true);
    setError(null);

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('Contatos')
      .select('*')
      .order('nome_completo', { ascending: true })
      .range(from, to);

    if (error) {
      setError(error.message);
      setContatos([]);
    } else if (data) {
      setContatos(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchContatos(page);
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (contatos.length === limit) setPage(page + 1);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1C407D',
        padding: 20,
        boxSizing: 'border-box',
        color: '#FFFFFF',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div style={containerWrapperStyle}>
        <Link to="/" style={voltarStyle}>
          ← Voltar para Home
        </Link>

        <div style={containerStyle}>
          <h2 style={titleStyle}>Consulta de Contatos</h2>

          <button onClick={() => fetchContatos(page)} style={buttonStyle} disabled={loading}>
            {loading ? 'Carregando...' : 'Atualizar Lista'}
          </button>

          {error && <p style={errorStyle}>Erro: {error}</p>}

          {!loading && contatos.length === 0 && <p>Nenhum contato encontrado.</p>}

          {contatos.length > 0 && (
            <>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Nome Completo</th>
                    <th style={thStyle}>Celular</th>
                    <th style={thStyle}>CEP Residência</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>LinkedIn</th>
                    <th style={thStyle}>Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {contatos.map((contato, index) => (
                    <tr key={contato.id} style={index % 2 === 0 ? evenRowStyle : undefined}>
                      <td style={tdStyle}>{contato.nome_completo || '-'}</td>
                      <td style={tdStyle}>{contato.celular || '-'}</td>
                      <td style={tdStyle}>{contato.cep_residencia || '-'}</td>
                      <td style={tdStyle}>{contato.email || '-'}</td>
                      <td style={tdStyle}>
                        {contato.linkedin ? (
                          <a
                            href={contato.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#0096FA' }}
                          >
                            Perfil
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td style={tdStyle}>
                        {contato.cadastro_at
                          ? new Date(contato.cadastro_at).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={paginationContainerStyle}>
                <button
                  style={navButtonStyle}
                  onClick={handlePrevPage}
                  disabled={page === 1 || loading}
                >
                  Anterior
                </button>

                <span style={pageNumberStyle}>Página {page}</span>

                <button
                  style={navButtonStyle}
                  onClick={handleNextPage}
                  disabled={contatos.length < limit || loading}
                >
                  Próxima
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const voltarStyle: React.CSSProperties = {
  display: 'inline-block',
  marginBottom: 20,
  color: '#0096FA',
  fontWeight: 600,
  textDecoration: 'none',
  cursor: 'pointer',
  fontSize: 16,
};

const containerWrapperStyle: React.CSSProperties = {
  maxWidth: 900,
  margin: '40px auto',
  padding: '0 24px',
};

const containerStyle: React.CSSProperties = {
  backgroundColor: '#1C407D',
  borderRadius: 16,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  padding: 24,
};

const titleStyle: React.CSSProperties = {
  marginBottom: 20,
  fontWeight: 700,
  fontSize: 24,
  color: '#FFFFFF',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#0096FA',
  border: 'none',
  padding: '10px 16px',
  color: '#FFFFFF',
  borderRadius: 8,
  cursor: 'pointer',
  marginBottom: 20,
};

const errorStyle: React.CSSProperties = {
  color: '#F5D010',
  marginBottom: 12,
  fontWeight: 600,
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
  fontSize: 14,
};

const thStyle: React.CSSProperties = {
  backgroundColor: '#F5D010',
  color: '#000000',
  padding: '12px 8px',
  fontWeight: 700,
  borderBottom: '2px solid #BCBEC0',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 8px',
  borderBottom: '1px solid #BCBEC0',
  color: '#FFFFFF',
};

const evenRowStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
};

const paginationContainerStyle: React.CSSProperties = {
  marginTop: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
};

const navButtonStyle: React.CSSProperties = {
  backgroundColor: '#0096FA',
  border: 'none',
  padding: '8px 14px',
  color: '#FFFFFF',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: 14,
};

const pageNumberStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 16,
  color: '#FFFFFF',
};
