import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const isGestor = usuario?.tipo_perfil === 'GESTOR';
    
    const [dados, setDados] = useState(null);
    const [solicitacoes, setSolicitacoes] = useState([]); // <--- NOVO: Lista de pedidos
    const [loading, setLoading] = useState(true);

    function handleLogout() {
        localStorage.clear();
        navigate('/');
    }

    async function fetchDashboard() {
        try {
            const response = await api.get('/gestao/dashboard');
            setDados(response.data);

            // SE FOR VOLUNTÁRIO: Busca também as solicitações pendentes
            if (response.data.perfil === 'VOLUNTARIO') {
                const respSolicitacoes = await api.get('/agendamentos/pendentes');
                setSolicitacoes(respSolicitacoes.data);
            }

        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboard();
    }, []);

    // Função para Aceitar ou Recusar (RF02)
    async function responderAgendamento(id, status) {
        try {
            await api.patch(`/agendamentos/${id}/responder`, { novo_status: status });
            alert(`Agendamento ${status} com sucesso!`);
            fetchDashboard(); // Recarrega a tela para atualizar as listas
        } catch (error) {
            alert("Erro ao processar solicitação.");
        }
    }

    if (loading) return <div className="loading-screen">Carregando...</div>;

    return (
        <div className="dashboard-layout">
            <header className="navbar">
                <div className="navbar-brand">
                    <h2>Conecta Saber</h2>
                    <span className="badge-role">{usuario?.tipo_perfil}</span>
                </div>
                
                <div className="navbar-menu" style={{display: 'flex', gap: '15px'}}>
                    {isGestor && (
                        <>
                            <button onClick={() => navigate('/voluntarios')} className="btn-secondary btn-sm">Validar Voluntários</button>
                            <button onClick={() => navigate('/historico')} className="btn-secondary btn-sm">Histórico</button>
                        </>
                    )}
                    <button onClick={handleLogout} className="btn-secondary btn-sm" style={{borderColor: '#EF4444', color: '#EF4444'}}>Sair</button>
                </div>
            </header>

            <main className="content-container">
                {/* --- VISÃO DO GESTOR (Mantida igual) --- */}
                {dados?.perfil === 'GESTOR' && (
                    <>
                        <div className="page-header">
                            <h1>Painel de Impacto Geral</h1>
                        </div>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="icon-box blue">📚</div>
                                <div><h3>Aulas Realizadas</h3><p className="stat-value">{dados.impacto_social.total_aulas_realizadas}</p></div>
                            </div>
                            <div className="stat-card">
                                <div className="icon-box green">⏱️</div>
                                <div><h3>Horas de Ensino</h3><p className="stat-value">{dados.impacto_social.estimativa_horas_ensino}h</p></div>
                            </div>
                        </div>
                        {/* ... Resto do Gestor ... */}
                    </>
                )}

                {/* --- VISÃO DO VOLUNTÁRIO (Atualizada) --- */}
                {dados?.perfil === 'VOLUNTARIO' && (
                    <>
                        <div className="page-header">
                            <h1>Meu Painel</h1>
                            <p>Gerencie suas aulas e solicitações.</p>
                        </div>

                        {/* KPIS */}
                        <div className="stats-grid" style={{ marginBottom: '40px' }}>
                            <div className="stat-card">
                                <div className="icon-box blue">🎓</div>
                                <div><h3>Aulas Dadas</h3><p className="stat-value">{dados.kpis.aulas_concluidas}</p></div>
                            </div>
                            <div className="stat-card">
                                <div className="icon-box purple">👥</div>
                                <div><h3>Alunos</h3><p className="stat-value">{dados.kpis.alunos_impactados}</p></div>
                            </div>
                        </div>

                        {/* --- NOVA SEÇÃO: SOLICITAÇÕES PENDENTES --- */}
                        {solicitacoes.length > 0 && (
                            <div className="section-container" style={{border: '1px solid #F59E0B', borderRadius: '12px', padding: '20px', background: '#FFFBEB', marginBottom: '30px'}}>
                                <h2 style={{color: '#B45309'}}>🔔 Solicitações Pendentes</h2>
                                <p style={{marginBottom: '15px', fontSize: '0.9rem', color: '#B45309'}}>Alunos aguardando sua confirmação:</p>
                                
                                <div className="table-responsive">
                                    <table className="custom-table">
                                        <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Aluno</th>
                                                <th>Disciplina</th>
                                                <th>Ação</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {solicitacoes.map((sol) => (
                                                <tr key={sol.id_agendamento} style={{background: '#FFF'}}>
                                                    <td>{new Date(sol.data_aula).toLocaleDateString()}</td>
                                                    <td>{sol.nome_aluno}</td>
                                                    <td>{sol.disciplina}</td>
                                                    <td style={{display: 'flex', gap: '10px'}}>
                                                        <button 
                                                            className="btn-primary btn-sm"
                                                            style={{backgroundColor: '#10B981'}} // Verde
                                                            onClick={() => responderAgendamento(sol.id_agendamento, 'CONFIRMADO')}
                                                        >
                                                            Aceitar
                                                        </button>
                                                        <button 
                                                            className="btn-secondary btn-sm"
                                                            style={{borderColor: '#EF4444', color: '#EF4444'}} // Vermelho
                                                            onClick={() => responderAgendamento(sol.id_agendamento, 'CANCELADO')}
                                                        >
                                                            Recusar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* AULAS CONFIRMADAS */}
                        <div className="section-container">
                            <h2>📅 Próximas Aulas (Agenda)</h2>
                            <div className="table-responsive">
                                <table className="custom-table">
                                    <thead>
                                        <tr>
                                            <th>Data</th>
                                            <th>Horário</th>
                                            <th>Disciplina</th>
                                            <th>Aluno</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dados.proximas_aulas.length > 0 ? (
                                            dados.proximas_aulas.map((aula, index) => (
                                                <tr key={index}>
                                                    <td>{new Date(aula.data_aula).toLocaleDateString()}</td>
                                                    <td>{aula.horario_inicio.slice(0,5)}</td>
                                                    <td>{aula.disciplina}</td>
                                                    <td>{aula.nome_aluno}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="4">Nenhuma aula confirmada.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default Dashboard;