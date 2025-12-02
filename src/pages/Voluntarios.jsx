import { useEffect, useState } from 'react';
import api from '../services/api';

function Voluntarios() {
    const [pendentes, setPendentes] = useState([]);

    useEffect(() => {
        carregarPendentes();
    }, []);

    async function carregarPendentes() {
        // Busca apenas os PENDENTES para aprovação
        const response = await api.get('/gestao/voluntarios?status=PENDENTE');
        setPendentes(response.data);
    }

    async function handleAprovar(id) {
        if(window.confirm("Deseja aprovar este voluntário?")) {
            await api.patch(`/gestao/voluntarios/${id}/aprovar`);
            alert("Voluntário aprovado!");
            carregarPendentes(); // Recarrega a lista
        }
    }

    return (
        <div className="dashboard-layout content-container">
            <div className="page-header">
                <h1>Aprovação de Voluntários (RF01)</h1>
                <p>Valide o cadastro de novos voluntários para permitir que eles ofertem aulas.</p>
            </div>

            <div className="table-responsive">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Data Cadastro</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendentes.length > 0 ? (
                            pendentes.map(vol => (
                                <tr key={vol.id}>
                                    <td>{vol.nome}</td>
                                    <td>{vol.email}</td>
                                    <td>{new Date(vol.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button 
                                            className="btn-primary btn-sm"
                                            onClick={() => handleAprovar(vol.id)}
                                            style={{backgroundColor: '#10B981'}} // Verde
                                        >
                                            Aprovar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4">Nenhum voluntário pendente.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Voluntarios;