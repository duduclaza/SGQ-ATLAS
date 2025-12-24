import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './components/layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NaoConformidades from './pages/NaoConformidades';
import Reclamacoes from './pages/Reclamacoes';
import NPS from './pages/NPS';
import Documentos from './pages/Documentos';
import Fornecedores from './pages/Fornecedores';
import Relatorios from './pages/Relatorios';
import GestaoPoPs from './pages/GestaoPoPs';
import GestaoITs from './pages/GestaoITs';
import GestaoProcessos from './pages/GestaoProcessos';
import GestaoGarantias from './pages/GestaoGarantias';
import Ishikawa from './pages/Ishikawa';
import Pareto from './pages/Pareto';
import FMEA from './pages/FMEA';
import MelhoriasContinuas from './pages/MelhoriasContinuas';
import Auditorias from './pages/Auditorias';
import Quarentena from './pages/Quarentena';
import AmostrasLotes from './pages/AmostrasLotes';
import CadastroProdutos from './pages/CadastroProdutos';
import ControleDescartes from './pages/ControleDescartes';
import ControleTriagens from './pages/ControleTriagens';
import Configuracoes from './pages/Configuracoes';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Public Route wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />

                    {/* Protected Routes */}
                    <Route
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/nao-conformidades" element={<NaoConformidades />} />
                        <Route path="/reclamacoes" element={<Reclamacoes />} />
                        <Route path="/nps" element={<NPS />} />
                        <Route path="/documentos" element={<Documentos />} />
                        <Route path="/fornecedores" element={<Fornecedores />} />
                        <Route path="/relatorios" element={<Relatorios />} />
                        <Route path="/pops" element={<GestaoPoPs />} />
                        <Route path="/its" element={<GestaoITs />} />
                        <Route path="/processos" element={<GestaoProcessos />} />
                        <Route path="/garantias" element={<GestaoGarantias />} />
                        <Route path="/ishikawa" element={<Ishikawa />} />
                        <Route path="/pareto" element={<Pareto />} />
                        <Route path="/fmea" element={<FMEA />} />
                        <Route path="/melhorias" element={<MelhoriasContinuas />} />
                        <Route path="/auditorias" element={<Auditorias />} />
                        <Route path="/quarentena" element={<Quarentena />} />
                        <Route path="/amostras-lotes" element={<AmostrasLotes />} />
                        <Route path="/produtos" element={<CadastroProdutos />} />
                        <Route path="/descartes" element={<ControleDescartes />} />
                        <Route path="/triagens" element={<ControleTriagens />} />
                        <Route path="/configuracoes" element={<Configuracoes />} />
                    </Route>

                    {/* Catch all - redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
