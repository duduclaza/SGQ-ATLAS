import { NavLink, useLocation } from 'react-router-dom';
import {
    Home,
    FileText,
    Megaphone,
    Smile,
    Files,
    Users,
    BarChart3,
    ClipboardList,
    FileCode,
    Workflow,
    Shield,
    GitBranch,
    PieChart,
    AlertTriangle,
    TrendingUp,
    Search,
    Archive,
    Package,
    Trash2,
    Box,
    ClipboardCheck,
    Settings
} from 'lucide-react';

const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/nao-conformidades', label: 'Não Conformidades', icon: FileText },
    { path: '/reclamacoes', label: 'Reclamações', icon: Megaphone },
    { path: '/nps', label: 'NPS', icon: Smile },
    { path: '/documentos', label: 'Documentos', icon: Files },
    { path: '/fornecedores', label: 'Fornecedores', icon: Users },
    { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
    { path: '/pops', label: 'Gestão de POPs', icon: ClipboardList },
    { path: '/its', label: 'Gestão de ITs', icon: FileCode },
    { path: '/processos', label: 'Gestão de Processos (BPMN)', icon: Workflow },
    { path: '/garantias', label: 'Gestão de Garantias', icon: Shield },
    { path: '/ishikawa', label: 'Análises de Ishikawa', icon: GitBranch },
    { path: '/pareto', label: 'Análises de Pareto', icon: PieChart },
    { path: '/fmea', label: 'FMEA', icon: AlertTriangle },
    { path: '/melhorias', label: 'Melhoria Contínua', icon: TrendingUp },
    { path: '/auditorias', label: 'Controle de Auditorias', icon: Search },
    { path: '/quarentena', label: 'Controle da Quarentena', icon: Archive },
    { path: '/amostras-lotes', label: 'Controle de Amostras e Lotes', icon: Package },
    { path: '/produtos', label: 'Cadastro de Produtos', icon: Box },
    { path: '/descartes', label: 'Controle de Descartes', icon: Trash2 },
    { path: '/triagens', label: 'Triagens e Destinação', icon: ClipboardCheck },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="flex flex-col w-72 min-h-screen bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
                <div className="w-8 h-8 text-blue-600">
                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
                    </svg>
                </div>
                <h1 className="text-lg font-bold text-gray-900">SGQ ATLAS</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
                <div className="flex flex-col gap-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }
                `}
                            >
                                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Settings at bottom */}
            <div className="border-t border-gray-100 p-3">
                <NavLink
                    to="/configuracoes"
                    className={`
            flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm font-medium transition-all duration-200
            ${location.pathname === '/configuracoes'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }
          `}
                >
                    <Settings size={20} className={location.pathname === '/configuracoes' ? 'text-blue-600' : 'text-gray-500'} />
                    <span>Configurações</span>
                </NavLink>
            </div>
        </aside>
    );
};

export default Sidebar;
