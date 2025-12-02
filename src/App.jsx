import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importação das Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Voluntarios from './pages/Voluntarios'; // <--- Nova página
import Historico from './pages/Historico';     // <--- Nova página
import './index.css'

// Componente de Segurança (Guarda de Rota)
// Se não tiver token, manda de volta pro Login (/)
const RotaPrivada = ({ children }) => {
    const token = localStorage.getItem('token');
    
    // Opcional: Aqui você poderia verificar se o token expirou
    if (!token) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<Login />} />

        {/* Rotas Protegidas (Área de Gestão) */}
        <Route 
          path="/dashboard" 
          element={
            <RotaPrivada>
              <Dashboard />
            </RotaPrivada>
          } 
        />

        <Route 
          path="/voluntarios" 
          element={
            <RotaPrivada>
              <Voluntarios />
            </RotaPrivada>
          } 
        />

        <Route 
          path="/historico" 
          element={
            <RotaPrivada>
              <Historico />
            </RotaPrivada>
          } 
        />

        {/* Rota Coringa: Se digitar qualquer coisa errada, vai pro Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;