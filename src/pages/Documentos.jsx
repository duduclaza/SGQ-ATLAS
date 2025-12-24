import { useState, useEffect } from 'react';
import { Plus, Search, Files, FileText, Download, Upload, Edit, Trash2, Eye, FolderOpen, Clock, CheckCircle } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const CATEGORY_OPTIONS = [
    { value: 'politica', label: 'Política' },
    { value: 'procedimento', label: 'Procedimento' },
    { value: 'instrucao', label: 'Instrução' },
    { value: 'formulario', label: 'Formulário' },
    { value: 'registro', label: 'Registro' },
    { value: 'manual', label: 'Manual' },
    { value: 'outro', label: 'Outro' }
];

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

const getCategoryLabel = (category) => {
    const option = CATEGORY_OPTIONS.find(o => o.value === category);
    return option?.label || category;
};

const Documentos = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        codigo: '',
        titulo: '',
        descricao: '',
        categoria: '',
        versao: '1.0',
        status: 'rascunho',
        responsavel: '',
        aprovador: '',
        dataAprovacao: '',
        proximaRevisao: ''
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        const data = storage.getAll(STORAGE_KEYS.DOCUMENTOS);
        setItems(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedItem) {
            storage.update(STORAGE_KEYS.DOCUMENTOS, selectedItem.id, formData);
        } else {
            storage.add(STORAGE_KEYS.DOCUMENTOS, formData);
        }

        loadItems();
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (confirm('Deseja realmente excluir este documento?')) {
            storage.delete(STORAGE_KEYS.DOCUMENTOS, id);
            loadItems();
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setFormData({
            codigo: item.codigo || '',
            titulo: item.titulo || '',
            descricao: item.descricao || '',
            categoria: item.categoria || '',
            versao: item.versao || '1.0',
            status: item.status || 'rascunho',
            responsavel: item.responsavel || '',
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
            descricao: '',
            categoria: '',
            versao: '1.0',
            status: 'rascunho',
            responsavel: '',
            aprovador: '',
            dataAprovacao: '',
            proximaRevisao: ''
        });
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || item.categoria === categoryFilter;
        const matchesStatus = !statusFilter || item.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
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
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de Documentos</h1>
                    <p className="text-gray-500 mt-1">Controle de documentos e versionamento</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                    Novo Documento
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg">
                            <Files className="text-gray-600" size={20} />
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
                    placeholder="Todas categorias"
                    options={CATEGORY_OPTIONS}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    containerClassName="w-full md:w-48"
                />
                <Select
                    placeholder="Todos os status"
                    options={STATUS_OPTIONS}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    containerClassName="w-full md:w-48"
                />
            </div>

            {/* Document Grid */}
            {filteredItems.length === 0 ? (
                <Card className="py-12 text-center">
                    <FolderOpen className="mx-auto mb-3 text-gray-300" size={48} />
                    <p className="text-gray-500">Nenhum documento encontrado</p>
                    <Button variant="ghost" className="mt-3" onClick={() => setIsModalOpen(true)}>
                        Criar primeiro documento
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                        <Card key={item.id} hover className="cursor-pointer" onClick={() => handleView(item)}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FileText className="text-blue-600" size={24} />
                                </div>
                                <span className={`badge ${getStatusColor(item.status)}`}>
                                    {getStatusLabel(item.status)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 font-mono mb-1">{item.codigo}</p>
                            <h3 className="font-semibold text-gray-900 mb-2">{item.titulo}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.descricao || 'Sem descrição'}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">v{item.versao}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-400 capitalize">{getCategoryLabel(item.categoria)}</span>
                                </div>
                                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <Edit size={16} className="text-gray-500" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} className="text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedItem ? 'Editar Documento' : 'Novo Documento'}
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit}>
                            {selectedItem ? 'Salvar Alterações' : 'Criar Documento'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Código"
                            placeholder="DOC-001"
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
                    </div>

                    <Input
                        label="Título"
                        placeholder="Título do documento"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        required
                    />

                    <Textarea
                        label="Descrição"
                        placeholder="Descrição do documento"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows={3}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                            label="Categoria"
                            options={CATEGORY_OPTIONS}
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                        />
                        <Select
                            label="Status"
                            options={STATUS_OPTIONS}
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Responsável"
                            placeholder="Nome do responsável"
                            value={formData.responsavel}
                            onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
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
                title="Detalhes do Documento"
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" icon={Download}>Baixar</Button>
                        <Button onClick={() => {
                            setIsViewModalOpen(false);
                            handleEdit(selectedItem);
                        }}>Editar</Button>
                    </>
                }
            >
                {selectedItem && (
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <FileText className="text-blue-600" size={32} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-mono text-gray-500">{selectedItem.codigo}</span>
                                    <span className="text-sm text-gray-400">•</span>
                                    <span className="text-sm text-gray-500">v{selectedItem.versao}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">{selectedItem.titulo}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`badge ${getStatusColor(selectedItem.status)}`}>
                                        {getStatusLabel(selectedItem.status)}
                                    </span>
                                    <span className="badge badge-gray capitalize">{getCategoryLabel(selectedItem.categoria)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Descrição</p>
                            <p className="text-gray-700">{selectedItem.descricao || 'Sem descrição'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Responsável</p>
                                <p className="font-medium">{selectedItem.responsavel || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Aprovador</p>
                                <p className="font-medium">{selectedItem.aprovador || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Data de Aprovação</p>
                                <p className="font-medium">
                                    {selectedItem.dataAprovacao ? new Date(selectedItem.dataAprovacao).toLocaleDateString('pt-BR') : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Próxima Revisão</p>
                                <p className="font-medium">
                                    {selectedItem.proximaRevisao ? new Date(selectedItem.proximaRevisao).toLocaleDateString('pt-BR') : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Criado em</p>
                                <p className="font-medium">{new Date(selectedItem.createdAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Última Atualização</p>
                                <p className="font-medium">{new Date(selectedItem.updatedAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Documentos;
