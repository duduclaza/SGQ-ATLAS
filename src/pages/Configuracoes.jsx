// Configurações do Sistema
import { useState } from 'react';
import { Settings, User, Building2, Bell, Shield, Database, Palette } from 'lucide-react';
import { Button, Card, Input, Select } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../services/storage';

const Configuracoes = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('perfil');
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [companyData, setCompanyData] = useState({
        nome: '',
        cnpj: '',
        endereco: '',
        telefone: ''
    });

    const tabs = [
        { id: 'perfil', label: 'Meu Perfil', icon: User },
        { id: 'empresa', label: 'Empresa', icon: Building2 },
        { id: 'notificacoes', label: 'Notificações', icon: Bell },
        { id: 'seguranca', label: 'Segurança', icon: Shield },
        { id: 'dados', label: 'Dados', icon: Database },
        { id: 'aparencia', label: 'Aparência', icon: Palette }
    ];

    const handleProfileSave = () => {
        updateUser(profileData);
        alert('Perfil atualizado com sucesso!');
    };

    const handleClearData = () => {
        if (confirm('Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita.')) {
            storage.clearAll();
            alert('Todos os dados foram removidos.');
            window.location.reload();
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg"><Settings className="text-gray-600" size={24} /></div>
                <div><h1 className="text-2xl font-bold text-gray-900">Configurações</h1><p className="text-gray-500">Gerencie as configurações do sistema</p></div>
            </div>

            <div className="flex gap-6">
                {/* Sidebar */}
                <div className="w-64 shrink-0">
                    <Card padding="p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <tab.icon size={20} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </Card>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === 'perfil' && (
                        <Card>
                            <h2 className="text-lg font-semibold mb-4">Meu Perfil</h2>
                            <div className="space-y-4 max-w-md">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                        {profileData.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <Button variant="secondary" size="sm">Alterar Foto</Button>
                                    </div>
                                </div>
                                <Input label="Nome" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                                <Input label="E-mail" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                                <Button onClick={handleProfileSave}>Salvar Alterações</Button>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'empresa' && (
                        <Card>
                            <h2 className="text-lg font-semibold mb-4">Dados da Empresa</h2>
                            <div className="space-y-4 max-w-md">
                                <Input label="Nome da Empresa" value={companyData.nome} onChange={(e) => setCompanyData({ ...companyData, nome: e.target.value })} />
                                <Input label="CNPJ" value={companyData.cnpj} onChange={(e) => setCompanyData({ ...companyData, cnpj: e.target.value })} />
                                <Input label="Endereço" value={companyData.endereco} onChange={(e) => setCompanyData({ ...companyData, endereco: e.target.value })} />
                                <Input label="Telefone" value={companyData.telefone} onChange={(e) => setCompanyData({ ...companyData, telefone: e.target.value })} />
                                <Button>Salvar</Button>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'notificacoes' && (
                        <Card>
                            <h2 className="text-lg font-semibold mb-4">Notificações</h2>
                            <div className="space-y-4">
                                {[
                                    { label: 'Notificações por e-mail', desc: 'Receba atualizações importantes por e-mail' },
                                    { label: 'Alertas de NCs', desc: 'Notificar quando novas NCs forem registradas' },
                                    { label: 'Lembretes de auditorias', desc: 'Receber lembretes de auditorias agendadas' },
                                    { label: 'Vencimento de documentos', desc: 'Alertas quando documentos estiverem próximos da revisão' }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'seguranca' && (
                        <Card>
                            <h2 className="text-lg font-semibold mb-4">Segurança</h2>
                            <div className="space-y-4 max-w-md">
                                <Input label="Senha Atual" type="password" />
                                <Input label="Nova Senha" type="password" />
                                <Input label="Confirmar Nova Senha" type="password" />
                                <Button>Alterar Senha</Button>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'dados' && (
                        <Card>
                            <h2 className="text-lg font-semibold mb-4">Gerenciamento de Dados</h2>
                            <div className="space-y-6">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h3 className="font-medium text-blue-900 mb-2">Exportar Dados</h3>
                                    <p className="text-sm text-blue-700 mb-3">Exporte todos os dados do sistema em formato JSON.</p>
                                    <Button variant="secondary" size="sm">Exportar JSON</Button>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                    <h3 className="font-medium text-yellow-900 mb-2">Importar Dados</h3>
                                    <p className="text-sm text-yellow-700 mb-3">Importe dados de um arquivo JSON.</p>
                                    <Button variant="secondary" size="sm">Importar</Button>
                                </div>
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <h3 className="font-medium text-red-900 mb-2">Limpar Todos os Dados</h3>
                                    <p className="text-sm text-red-700 mb-3">Remove todos os dados armazenados. Esta ação é irreversível!</p>
                                    <Button variant="danger" size="sm" onClick={handleClearData}>Limpar Dados</Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'aparencia' && (
                        <Card>
                            <h2 className="text-lg font-semibold mb-4">Aparência</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="font-medium mb-2">Tema</p>
                                    <div className="flex gap-3">
                                        <button className="px-4 py-2 bg-white border-2 border-blue-500 rounded-lg font-medium text-blue-600">Claro</button>
                                        <button className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium">Escuro</button>
                                        <button className="px-4 py-2 bg-gray-200 rounded-lg font-medium">Sistema</button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Configuracoes;
