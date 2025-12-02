import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Historico() {
    const [agendamentos, setAgendamentos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function carregar() {
            try {
                const response = await api.get('/gestao/historico');
                setAgendamentos(response.data);
            } catch (error) {
                console.error("Erro ao carregar histórico");
            }
        }
        carregar();
    }, []);

    return (
        <div className="dashboard-layout">
            <header className="navbar">
                <div className="navbar-brand">
                    <h2>Conecta Saber</h2>
                    <span className="badge-role">Gestão</span>
                </div>
                <div>
                    <button onClick={() => navigate('/dashboard')} className="btn-secondary btn-sm">Voltar</button>
                </div>
            </header>

            <main className="content-container">
                <div className="page-header">
                    <h1>Histórico Geral</h1>
                    <p>Auditoria de todos os agendamentos realizados na plataforma.</p>
                </div>

                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Status</th>
                                <th>Aluno</th>
                                <th>Voluntário</th>
                                <th>Disciplina</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agendamentos.length > 0 ? (
                                agendamentos.map((item) => (
                                    <tr key={item.id}>
                                        <td>{new Date(item.data_aula).toLocaleDateString()}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 8px', 
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                backgroundColor: item.status === 'CONCLUIDO' ? '#D1FAE5' : 
                                                                 item.status === 'CANCELADO' ? '#FEE2E2' : '#EFF6FF',
                                                color: item.status === 'CONCLUIDO' ? '#065F46' : 
                                                       item.status === 'CANCELADO' ? '#991B1B' : '#1E40AF'
                                            }}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{item.aluno}</td>
                                        <td>{item.voluntario}</td>
                                        <td>{item.disciplina}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5">Nenhum registro encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default Historico;