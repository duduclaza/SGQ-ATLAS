import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Sun, Moon, LogOut, User, ChevronDown } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications = [
        { id: 1, title: 'Nova NC registrada', time: '5 min atrás', read: false },
        { id: 2, title: 'Auditoria agendada para amanhã', time: '1 hora atrás', read: false },
        { id: 3, title: 'Documento aprovado', time: '3 horas atrás', read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
            {/* Left side - can be used for breadcrumbs or search */}
            <div className="flex items-center gap-4">
                {/* Placeholder for breadcrumbs or search */}
            </div>

            {/* Right side - actions */}
            <div className="flex items-center gap-2">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowUserMenu(false);
                        }}
                        className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <Bell size={20} className="text-gray-700" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-slideIn">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">Notificações</h3>
                            </div>
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''}`}
                                >
                                    <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                </div>
                            ))}
                            <div className="px-4 py-2 border-t border-gray-100">
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Ver todas
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    {isDarkMode ? (
                        <Moon size={20} className="text-gray-700" />
                    ) : (
                        <Sun size={20} className="text-gray-700" />
                    )}
                </button>

                {/* User Menu */}
                <div className="relative ml-2">
                    <button
                        onClick={() => {
                            setShowUserMenu(!showUserMenu);
                            setShowNotifications(false);
                        }}
                        className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-gray-900">{user?.name || 'Usuário'}</p>
                            <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
                        </div>
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-slideIn">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                            <button
                                onClick={() => { }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <User size={18} />
                                Meu Perfil
                            </button>
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                            >
                                <LogOut size={18} />
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
