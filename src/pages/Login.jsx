import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setErro('');
        setLoading(true);

        try {
            const response = await api.post('/login', { email, senha });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
            navigate('/dashboard');
        } catch (err) {
            setErro('E-mail ou senha incorretos.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1 className="logo">Conecta Saber</h1>
                    <p className="subtitle">Gestão Educacional</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input 
                            id="email"
                            type="email" 
                            placeholder="ex: admin@escola.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="senha">Senha</label>
                        <input 
                            id="senha"
                            type="password" 
                            placeholder="••••••••" 
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>
                    
                    {erro && <div className="alert-error">{erro}</div>}
                    
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Entrando...' : 'Acessar Painel'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Esqueceu a senha? Contate o suporte.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;