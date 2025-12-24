import { useState, useEffect } from 'react';
import { Plus, Search, ClipboardList, FileText, CheckCircle, Clock, AlertCircle, Edit, Trash2, Eye } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const STATUS_OPTIONS = [
    { value: 'rascunho', label: 'Rascunho' },
    { value: 'em_revisao', label: 'Em Revisão' },
    { value: 'aprovado', label: 'Aprovado' },
    { value: 'obsoleto', label: 'Obsoleto' }
];

const getStatusColor = (status) => {
    switch (status) {
        case 'rascunho': return 'badge-gray';
        case 'em_revisao': return 'badge-warning';
        case 'aprovado': return 'badge-success';
        case 'obsoleto': return 'badge-danger';
        default: return 'badge-gray';
    }
};

const getStatusLabel = (status) => {
    const option = STATUS_OPTIONS.find(o => o.value === status);
    return option?.label || status;
};

const GestaoPoPs = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        codigo: '',
        titulo: '',
        objetivo: '',
        abrangencia: '',
        responsabilidades: '',
        procedimento: '',
        versao: '1.0',
        status: 'rascunho',
        elaborador: '',
        revisor: '',
        aprovador: '',
        dataAprovacao: '',
        proximaRevisao: ''
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        const data = storage.getAll(STORAGE_KEYS.POPS);
        setItems(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedItem) {
            storage.update(STORAGE_KEYS.POPS, selectedItem.id, formData);
        } else {
            storage.add(STORAGE_KEYS.POPS, formData);
        }

        loadItems();
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (confirm('Deseja realmente excluir este POP?')) {
            storage.delete(STORAGE_KEYS.POPS, id);
            loadItems();
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setFormData({
            codigo: item.codigo || '',
            titulo: item.titulo || '',
            objetivo: item.objetivo || '',
            abrangencia: item.abrangencia || '',
            responsabilidades: item.responsabilidades || '',
            procedimento: item.procedimento || '',
            versao: item.versao || '1.0',
            status: item.status || 'rascunho',
            elaborador: item.elaborador || '',
            revisor: item.revisor || '',
            aprovador: item.aprovador || '',
            dataAprovacao: item.dataAprovacao || '',
            proximaRevisao: item.proximaRevisao || ''
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
            codigo: '',
            titulo: '',
            objetivo: '',
            abrangencia: '',
            responsabilidades: '',
            procedimento: '',
            versao: '1.0',
            status: 'rascunho',
            elaborador: '',
            revisor: '',
            aprovador: '',
            dataAprovacao: '',
            proximaRevisao: ''
        });
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: items.length,
        aprovados: items.filter(i => i.status === 'aprovado').length,
        emRevisao: items.filter(i => i.status === 'em_revisao').length,
        rascunhos: items.filter(i => i.status === 'rascunho').length
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de POPs</h1>
                    <p className="text-gray-500 mt-1">Procedimentos Operacionais Padrão</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                    Novo POP
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg">
                            <ClipboardList className="text-gray-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-green-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-green-600">Aprovados</p>
                            <p className="text-2xl font-bold text-green-700">{stats.aprovados}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-yellow-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-yellow-600">Em Revisão</p>
                            <p className="text-2xl font-bold text-yellow-700">{stats.emRevisao}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-blue-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-blue-600">Rascunhos</p>
                            <p className="text-2xl font-bold text-blue-700">{stats.rascunhos}</p>
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
                        placeholder="Buscar por título ou código..."
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
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Código</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Título</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Versão</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Elaborador</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Data</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-500">
                                        <ClipboardList className="mx-auto mb-3 text-gray-300" size={48} />
                                        <p>Nenhum POP encontrado</p>
                                        <Button variant="ghost" className="mt-3" onClick={() => setIsModalOpen(true)}>
                                            Criar primeiro POP
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-mono text-blue-600">{item.codigo}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-gray-900">{item.titulo}</p>
                                            <p className="text-sm text-gray-500 truncate max-w-xs">{item.objetivo}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-600">v{item.versao}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`badge ${getStatusColor(item.status)}`}>
                                                {getStatusLabel(item.status)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-600">{item.elaborador || '-'}</span>
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
                title={selectedItem ? 'Editar POP' : 'Novo POP'}
                size="xl"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit}>
                            {selectedItem ? 'Salvar Alterações' : 'Criar POP'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Código"
                            placeholder="POP-001"
                            value={formData.codigo}
                            onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                            required
                        />
                        <Input
                            label="Versão"
                            placeholder="1.0"
                            value={formData.versao}
                            onChange={(e) => setFormData({ ...formData, versao: e.target.value })}
                        />
                        <Select
                            label="Status"
                            options={STATUS_OPTIONS}
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Título"
                        placeholder="Título do procedimento"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        required
                    />

                    <Textarea
                        label="Objetivo"
                        placeholder="Objetivo do procedimento"
                        value={formData.objetivo}
                        onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                        rows={2}
                    />

                    <Textarea
                        label="Abrangência"
                        placeholder="Setores/processos abrangidos"
                        value={formData.abrangencia}
                        onChange={(e) => setFormData({ ...formData, abrangencia: e.target.value })}
                        rows={2}
                    />

                    <Textarea
                        label="Responsabilidades"
                        placeholder="Responsabilidades de cada envolvido"
                        value={formData.responsabilidades}
                        onChange={(e) => setFormData({ ...formData, responsabilidades: e.target.value })}
                        rows={2}
                    />

                    <Textarea
                        label="Procedimento"
                        placeholder="Descrição detalhada do procedimento"
                        value={formData.procedimento}
                        onChange={(e) => setFormData({ ...formData, procedimento: e.target.value })}
                        rows={4}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Elaborador"
                            placeholder="Nome do elaborador"
                            value={formData.elaborador}
                            onChange={(e) => setFormData({ ...formData, elaborador: e.target.value })}
                        />
                        <Input
                            label="Revisor"
                            placeholder="Nome do revisor"
                            value={formData.revisor}
                            onChange={(e) => setFormData({ ...formData, revisor: e.target.value })}
                        />
                        <Input
                            label="Aprovador"
                            placeholder="Nome do aprovador"
                            value={formData.aprovador}
                            onChange={(e) => setFormData({ ...formData, aprovador: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Data de Aprovação"
                            type="date"
                            value={formData.dataAprovacao}
                            onChange={(e) => setFormData({ ...formData, dataAprovacao: e.target.value })}
                        />
                        <Input
                            label="Próxima Revisão"
                            type="date"
                            value={formData.proximaRevisao}
                            onChange={(e) => setFormData({ ...formData, proximaRevisao: e.target.value })}
                        />
                    </div>
                </form>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedItem(null);
                }}
                title={`POP ${selectedItem?.codigo}`}
                size="xl"
            >
                {selectedItem && (
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{selectedItem.titulo}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm text-gray-500">v{selectedItem.versao}</span>
                                    <span className={`badge ${getStatusColor(selectedItem.status)}`}>
                                        {getStatusLabel(selectedItem.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-1">Objetivo</p>
                                <p className="text-gray-600">{selectedItem.objetivo || 'Não definido'}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-1">Abrangência</p>
                                <p className="text-gray-600">{selectedItem.abrangencia || 'Não definida'}</p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 mb-1">Responsabilidades</p>
                                <p className="text-gray-600 whitespace-pre-line">{selectedItem.responsabilidades || 'Não definidas'}</p>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm font-medium text-blue-700 mb-1">Procedimento</p>
                                <p className="text-blue-800 whitespace-pre-line">{selectedItem.procedimento || 'Não definido'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                            <div>
                                <p className="text-sm text-gray-500">Elaborador</p>
                                <p className="font-medium">{selectedItem.elaborador || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Revisor</p>
                                <p className="font-medium">{selectedItem.revisor || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Aprovador</p>
                                <p className="font-medium">{selectedItem.aprovador || '-'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default GestaoPoPs;
