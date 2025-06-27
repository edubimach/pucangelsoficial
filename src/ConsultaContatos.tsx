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

const navButtonStyle: React.CSSProperties = {
  backgroundColor: '#0096FA',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: 6,
  padding: '6px 12px',
  cursor: 'pointer',
  fontSize: 14,
};

const paginacaoStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 20,
  color: '#FFFFFF',
};

export function ConsultaContatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchNome, setSearchNome] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchCelular, setSearchCelular] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / pageSize);

  // Função para buscar contatos com paginação e filtro no backend
  const fetchContatos = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;

    // Construir filtros no backend
    let query = supabase
      .from('Contatos')
      .select('*', { count: 'exact' })
      .order('nome_completo', { ascending: true })
      .range(from, to);

    // Aplicar filtros se houver texto
    if (searchNome.trim() !== '') {
      query = query.ilike('nome_completo', `%${searchNome.trim()}%`);
    }
    if (searchEmail.trim() !== '') {
      query = query.ilike('email', `%${searchEmail.trim()}%`);
    }
    if (searchCelular.trim() !== '') {
      query = query.ilike('celular', `%${searchCelular.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
      setContatos([]);
      setTotalCount(0);
    } else {
      setContatos(data || []);
      // O count vem no data? Na API do supabase, ele vem separado, mas pode ser necessário
      // para isso, precisa habilitar a opção 'count: exact' no select, já feita.
      // Mas data não traz count, precisa pegar do meta (não retornado diretamente).
      // Para simplificar, vou buscar count separado abaixo.
    }

    setLoading(false);
  };

  // Função para buscar o total de registros com filtros aplicados
  const fetchTotalCount = async () => {
    let countQuery = supabase
      .from('Contatos')
      .select('id', { count: 'exact', head: true });

    if (searchNome.trim() !== '') {
      countQuery = countQuery.ilike('nome_completo', `%${searchNome.trim()}%`);
    }
    if (searchEmail.trim() !== '') {
      countQuery = countQuery.ilike('email', `%${searchEmail.trim()}%`);
    }
    if (searchCelular.trim() !== '') {
      countQuery = countQuery.ilike('celular', `%${searchCelular.trim()}%`);
    }

    const { count, error } = await countQuery;

    if (error) {
      setError(error.message);
      setTotalCount(0);
    } else {
      setTotalCount(count || 0);
    }
  };

  // Atualiza a lista e o total toda vez que a página ou filtros mudam
  useEffect(() => {
    fetchTotalCount();
    fetchContatos(currentPage);
  }, [currentPage, searchNome, searchEmail, searchCelular]);

  // Quando os filtros mudam, volta para a página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchNome, searchEmail, searchCelular]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1C407D',
        padding: 20,
        color: '#FFF',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
        <Link to="/" style={voltarStyle}>
          ← Voltar para Home
        </Link>

        <div style={containerStyle}>
          <h2 style={titleStyle}>Consulta de Cadastro de Associados e Membros</h2>

          <button onClick={() => fetchContatos(currentPage)} style={buttonStyle} disabled={loading}>
            {loading ? 'Carregando...' : 'Atualizar Lista'}
          </button>

          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Pesquisar Nome"
              value={searchNome}
              onChange={(e) => setSearchNome(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Pesquisar Email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Pesquisar Celular"
              value={searchCelular}
              onChange={(e) => setSearchCelular(e.target.value)}
              style={inputStyle}
            />
          </div>

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
                          <a href={contato.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0096FA' }}>
                            Perfil
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td style={tdStyle}>{contato.cadastro_at ? new Date(contato.cadastro_at).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={paginacaoStyle}>
                <button style={navButtonStyle} disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                  ← Anterior
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button style={navButtonStyle} disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
                  Próxima →
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

const inputStyle: React.CSSProperties = {
  padding: 8,
  borderRadius: 8,
  border: '1px solid #BCBEC0',
  fontSize: 14,
  width: '100%',
  maxWidth: 200,
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
