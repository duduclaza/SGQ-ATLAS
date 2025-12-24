import { useState, useEffect } from 'react';
import { Plus, Search, Megaphone, MessageSquare, Clock, CheckCircle, Edit, Trash2, Eye, AlertCircle } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const STATUS_OPTIONS = [
    { value: 'aberta', label: 'Aberta' },
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'respondida', label: 'Respondida' },
    { value: 'fechada', label: 'Fechada' }
];

const ORIGIN_OPTIONS = [
    { value: 'email', label: 'E-mail' },
    { value: 'telefone', label: 'Telefone' },
    { value: 'presencial', label: 'Presencial' },
    { value: 'site', label: 'Site' },
    { value: 'redes_sociais', label: 'Redes Sociais' }
];

const PRIORITY_OPTIONS = [
    { value: 'baixa', label: 'Baixa' },
    { value: 'normal', label: 'Normal' },
    { value: 'alta', label: 'Alta' },
    { value: 'urgente', label: 'Urgente' }
];

const getStatusColor = (status) => {
    switch (status) {
        case 'aberta': return 'badge-danger';
        case 'em_andamento': return 'badge-warning';
        case 'respondida': return 'badge-primary';
        case 'fechada': return 'badge-success';
        default: return 'badge-gray';
    }
};

const getStatusLabel = (status) => {
    const option = STATUS_OPTIONS.find(o => o.value === status);
    return option?.label || status;
};

const Reclamacoes = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        cliente: '',
        email: '',
        telefone: '',
        assunto: '',
        descricao: '',
        origem: '',
        prioridade: 'normal',
        status: 'aberta',
        resposta: ''
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        const data = storage.getAll(STORAGE_KEYS.RECLAMACOES);
        setItems(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedItem) {
            storage.update(STORAGE_KEYS.RECLAMACOES, selectedItem.id, formData);
        } else {
            storage.add(STORAGE_KEYS.RECLAMACOES, formData);
        }

        loadItems();
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (confirm('Deseja realmente excluir esta reclamação?')) {
            storage.delete(STORAGE_KEYS.RECLAMACOES, id);
            loadItems();
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setFormData({
            cliente: item.cliente || '',
            email: item.email || '',
            telefone: item.telefone || '',
            assunto: item.assunto || '',
            descricao: item.descricao || '',
            origem: item.origem || '',
            prioridade: item.prioridade || 'normal',
            status: item.status || 'aberta',
            resposta: item.resposta || ''
        });
        setIsModalOpen(true);
    };

    const handleView = (item) => {
        setSelectedItem(item);
        setIsViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setFormData({
            cliente: '',
            email: '',
            telefone: '',
            assunto: '',
            descricao: '',
            origem: '',
            prioridade: 'normal',
            status: 'aberta',
            resposta: ''
        });
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.assunto?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: items.length,
        abertas: items.filter(i => i.status === 'aberta').length,
        emAndamento: items.filter(i => i.status === 'em_andamento').length,
        fechadas: items.filter(i => i.status === 'fechada').length
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reclamações de Clientes</h1>
                    <p className="text-gray-500 mt-1">Gerencie e acompanhe as reclamações recebidas</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                    Nova Reclamação
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg">
                            <Megaphone className="text-gray-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-red-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="text-red-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-red-600">Abertas</p>
                            <p className="text-2xl font-bold text-red-700">{stats.abertas}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-yellow-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-yellow-600">Em Andamento</p>
                            <p className="text-2xl font-bold text-yellow-700">{stats.emAndamento}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-green-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-green-600">Fechadas</p>
                            <p className="text-2xl font-bold text-green-700">{stats.fechadas}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por cliente ou assunto..."
                        className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select
                    placeholder="Todos os status"
                    options={STATUS_OPTIONS}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    containerClassName="w-full md:w-48"
                />
            </div>

            {/* Table */}
            <Card padding="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">ID</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Cliente</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Assunto</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Origem</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Data</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-500">
                                        <Megaphone className="mx-auto mb-3 text-gray-300" size={48} />
                                        <p>Nenhuma reclamação encontrada</p>
                                        <Button variant="ghost" className="mt-3" onClick={() => setIsModalOpen(true)}>
                                            Registrar primeira reclamação
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-mono text-gray-500">#{item.id}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-gray-900">{item.cliente}</p>
                                            <p className="text-sm text-gray-500">{item.email}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-gray-700 truncate max-w-xs">{item.assunto}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-600 capitalize">{item.origem || '-'}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`badge ${getStatusColor(item.status)}`}>
                                                {getStatusLabel(item.status)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-500">
                                                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleView(item)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Eye size={18} className="text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <Edit size={18} className="text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} className="text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedItem ? 'Editar Reclamação' : 'Nova Reclamação'}
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit}>
                            {selectedItem ? 'Salvar Alterações' : 'Registrar'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Nome do Cliente"
                            placeholder="Nome completo"
                            value={formData.cliente}
                            onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                            required
                        />
                        <Input
                            label="E-mail"
                            type="email"
                            placeholder="email@exemplo.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Telefone"
                            placeholder="(00) 00000-0000"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        />
                        <Select
                            label="Origem"
                            options={ORIGIN_OPTIONS}
                            value={formData.origem}
                            onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Assunto"
                        placeholder="Assunto da reclamação"
                        value={formData.assunto}
                        onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                        required
                    />

                    <Textarea
                        label="Descrição"
                        placeholder="Descreva detalhadamente a reclamação"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows={3}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Prioridade"
                            options={PRIORITY_OPTIONS}
                            value={formData.prioridade}
                            onChange={(e) => setFormData({ ...formData, prioridade: e.target.value })}
                        />
                        <Select
                            label="Status"
                            options={STATUS_OPTIONS}
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        />
                    </div>

                    <Textarea
                        label="Resposta"
                        placeholder="Resposta ao cliente (opcional)"
                        value={formData.resposta}
                        onChange={(e) => setFormData({ ...formData, resposta: e.target.value })}
                        rows={2}
                    />
                </form>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedItem(null);
                }}
                title={`Reclamação #${selectedItem?.id}`}
                size="lg"
            >
                {selectedItem && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{selectedItem.cliente}</h3>
                                <p className="text-sm text-gray-500">{selectedItem.email} • {selectedItem.telefone}</p>
                            </div>
                            <span className={`badge ${getStatusColor(selectedItem.status)}`}>
                                {getStatusLabel(selectedItem.status)}
                            </span>
                        </div>

                        <div className="py-4 border-t border-b border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Assunto</p>
                            <p className="font-medium text-gray-900">{selectedItem.assunto}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Descrição</p>
                            <p className="text-gray-700">{selectedItem.descricao || 'Sem descrição'}</p>
                        </div>

                        {selectedItem.resposta && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-600 mb-1">Resposta</p>
                                <p className="text-blue-800">{selectedItem.resposta}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                            <div>
                                <p className="text-sm text-gray-500">Origem</p>
                                <p className="font-medium capitalize">{selectedItem.origem || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Prioridade</p>
                                <p className="font-medium capitalize">{selectedItem.prioridade}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Data</p>
                                <p className="font-medium">{new Date(selectedItem.createdAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Reclamacoes;
