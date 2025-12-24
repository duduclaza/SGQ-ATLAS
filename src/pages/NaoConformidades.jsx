import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, AlertCircle, CheckCircle, Clock, Edit, Trash2, Eye } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const STATUS_OPTIONS = [
    { value: 'aberta', label: 'Aberta' },
    { value: 'em_analise', label: 'Em Análise' },
    { value: 'fechada', label: 'Fechada' }
];

const SEVERITY_OPTIONS = [
    { value: 'baixa', label: 'Baixa' },
    { value: 'media', label: 'Média' },
    { value: 'alta', label: 'Alta' },
    { value: 'critica', label: 'Crítica' }
];

const TYPE_OPTIONS = [
    { value: 'produto', label: 'Produto' },
    { value: 'processo', label: 'Processo' },
    { value: 'sistema', label: 'Sistema' },
    { value: 'fornecedor', label: 'Fornecedor' }
];

const getStatusColor = (status) => {
    switch (status) {
        case 'aberta': return 'badge-danger';
        case 'em_analise': return 'badge-warning';
        case 'fechada': return 'badge-success';
        default: return 'badge-gray';
    }
};

const getStatusLabel = (status) => {
    const option = STATUS_OPTIONS.find(o => o.value === status);
    return option?.label || status;
};

const getSeverityColor = (severity) => {
    switch (severity) {
        case 'baixa': return 'text-green-600 bg-green-50';
        case 'media': return 'text-yellow-600 bg-yellow-50';
        case 'alta': return 'text-orange-600 bg-orange-50';
        case 'critica': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
    }
};

const NaoConformidades = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        tipo: '',
        severidade: '',
        status: 'aberta',
        responsavel: '',
        acaoCorretiva: '',
        prazo: ''
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        const data = storage.getAll(STORAGE_KEYS.NAO_CONFORMIDADES);
        setItems(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedItem) {
            storage.update(STORAGE_KEYS.NAO_CONFORMIDADES, selectedItem.id, formData);
        } else {
            storage.add(STORAGE_KEYS.NAO_CONFORMIDADES, formData);
        }

        loadItems();
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (confirm('Deseja realmente excluir esta não conformidade?')) {
            storage.delete(STORAGE_KEYS.NAO_CONFORMIDADES, id);
            loadItems();
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setFormData({
            titulo: item.titulo || '',
            descricao: item.descricao || '',
            tipo: item.tipo || '',
            severidade: item.severidade || '',
            status: item.status || 'aberta',
            responsavel: item.responsavel || '',
            acaoCorretiva: item.acaoCorretiva || '',
            prazo: item.prazo || ''
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
            titulo: '',
            descricao: '',
            tipo: '',
            severidade: '',
            status: 'aberta',
            responsavel: '',
            acaoCorretiva: '',
            prazo: ''
        });
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: items.length,
        abertas: items.filter(i => i.status === 'aberta').length,
        emAnalise: items.filter(i => i.status === 'em_analise').length,
        fechadas: items.filter(i => i.status === 'fechada').length
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Não Conformidades</h1>
                    <p className="text-gray-500 mt-1">Gerencie as não conformidades identificadas</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                    Nova NC
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg">
                            <AlertCircle className="text-gray-600" size={20} />
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
                            <p className="text-sm text-yellow-600">Em Análise</p>
                            <p className="text-2xl font-bold text-yellow-700">{stats.emAnalise}</p>
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
                        placeholder="Buscar não conformidades..."
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
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Título</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Tipo</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Severidade</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Data</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-500">
                                        <AlertCircle className="mx-auto mb-3 text-gray-300" size={48} />
                                        <p>Nenhuma não conformidade encontrada</p>
                                        <Button variant="ghost" className="mt-3" onClick={() => setIsModalOpen(true)}>
                                            Registrar primeira NC
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
                                            <p className="font-medium text-gray-900">{item.titulo}</p>
                                            <p className="text-sm text-gray-500 truncate max-w-xs">{item.descricao}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-600 capitalize">{item.tipo || '-'}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`badge ${getSeverityColor(item.severidade)}`}>
                                                {item.severidade || '-'}
                                            </span>
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
                title={selectedItem ? 'Editar Não Conformidade' : 'Nova Não Conformidade'}
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit}>
                            {selectedItem ? 'Salvar Alterações' : 'Registrar NC'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Título"
                        placeholder="Digite o título da NC"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        required
                    />

                    <Textarea
                        label="Descrição"
                        placeholder="Descreva detalhadamente a não conformidade"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows={3}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Tipo"
                            options={TYPE_OPTIONS}
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        />
                        <Select
                            label="Severidade"
                            options={SEVERITY_OPTIONS}
                            value={formData.severidade}
                            onChange={(e) => setFormData({ ...formData, severidade: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Status"
                            options={STATUS_OPTIONS}
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        />
                        <Input
                            label="Responsável"
                            placeholder="Nome do responsável"
                            value={formData.responsavel}
                            onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                        />
                    </div>

                    <Textarea
                        label="Ação Corretiva"
                        placeholder="Descreva a ação corretiva a ser tomada"
                        value={formData.acaoCorretiva}
                        onChange={(e) => setFormData({ ...formData, acaoCorretiva: e.target.value })}
                        rows={2}
                    />

                    <Input
                        label="Prazo"
                        type="date"
                        value={formData.prazo}
                        onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
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
                title={`NC #${selectedItem?.id}`}
                size="lg"
            >
                {selectedItem && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{selectedItem.titulo}</h3>
                            <div className="flex gap-2 mt-2">
                                <span className={`badge ${getStatusColor(selectedItem.status)}`}>
                                    {getStatusLabel(selectedItem.status)}
                                </span>
                                <span className={`badge ${getSeverityColor(selectedItem.severidade)}`}>
                                    {selectedItem.severidade}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
                            <div>
                                <p className="text-sm text-gray-500">Tipo</p>
                                <p className="font-medium capitalize">{selectedItem.tipo || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Responsável</p>
                                <p className="font-medium">{selectedItem.responsavel || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Data de Criação</p>
                                <p className="font-medium">{new Date(selectedItem.createdAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Prazo</p>
                                <p className="font-medium">{selectedItem.prazo ? new Date(selectedItem.prazo).toLocaleDateString('pt-BR') : '-'}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Descrição</p>
                            <p className="text-gray-700">{selectedItem.descricao || 'Sem descrição'}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 mb-1">Ação Corretiva</p>
                            <p className="text-gray-700">{selectedItem.acaoCorretiva || 'Sem ação corretiva definida'}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default NaoConformidades;
