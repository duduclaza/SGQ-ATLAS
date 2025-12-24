import { useState, useEffect } from 'react';
import { Plus, Search, Users, Building2, Star, Phone, Mail, MapPin, Edit, Trash2, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const STATUS_OPTIONS = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'em_avaliacao', label: 'Em Avaliação' },
    { value: 'bloqueado', label: 'Bloqueado' }
];

const CATEGORY_OPTIONS = [
    { value: 'materia_prima', label: 'Matéria Prima' },
    { value: 'servicos', label: 'Serviços' },
    { value: 'equipamentos', label: 'Equipamentos' },
    { value: 'embalagens', label: 'Embalagens' },
    { value: 'outros', label: 'Outros' }
];

const RATING_OPTIONS = [
    { value: '5', label: '★★★★★ Excelente' },
    { value: '4', label: '★★★★☆ Bom' },
    { value: '3', label: '★★★☆☆ Regular' },
    { value: '2', label: '★★☆☆☆ Ruim' },
    { value: '1', label: '★☆☆☆☆ Péssimo' }
];

const getStatusColor = (status) => {
    switch (status) {
        case 'ativo': return 'badge-success';
        case 'inativo': return 'badge-gray';
        case 'em_avaliacao': return 'badge-warning';
        case 'bloqueado': return 'badge-danger';
        default: return 'badge-gray';
    }
};

const getStatusLabel = (status) => {
    const option = STATUS_OPTIONS.find(o => o.value === status);
    return option?.label || status;
};

const Fornecedores = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        razaoSocial: '',
        nomeFantasia: '',
        cnpj: '',
        email: '',
        telefone: '',
        endereco: '',
        cidade: '',
        estado: '',
        categoria: '',
        status: 'ativo',
        avaliacao: '',
        contato: '',
        observacoes: ''
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        const data = storage.getAll(STORAGE_KEYS.FORNECEDORES);
        setItems(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectedItem) {
            storage.update(STORAGE_KEYS.FORNECEDORES, selectedItem.id, formData);
        } else {
            storage.add(STORAGE_KEYS.FORNECEDORES, formData);
        }

        loadItems();
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (confirm('Deseja realmente excluir este fornecedor?')) {
            storage.delete(STORAGE_KEYS.FORNECEDORES, id);
            loadItems();
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setFormData({
            razaoSocial: item.razaoSocial || '',
            nomeFantasia: item.nomeFantasia || '',
            cnpj: item.cnpj || '',
            email: item.email || '',
            telefone: item.telefone || '',
            endereco: item.endereco || '',
            cidade: item.cidade || '',
            estado: item.estado || '',
            categoria: item.categoria || '',
            status: item.status || 'ativo',
            avaliacao: item.avaliacao || '',
            contato: item.contato || '',
            observacoes: item.observacoes || ''
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
            razaoSocial: '',
            nomeFantasia: '',
            cnpj: '',
            email: '',
            telefone: '',
            endereco: '',
            cidade: '',
            estado: '',
            categoria: '',
            status: 'ativo',
            avaliacao: '',
            contato: '',
            observacoes: ''
        });
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.razaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nomeFantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.cnpj?.includes(searchTerm);
        const matchesStatus = !statusFilter || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: items.length,
        ativos: items.filter(i => i.status === 'ativo').length,
        emAvaliacao: items.filter(i => i.status === 'em_avaliacao').length,
        bloqueados: items.filter(i => i.status === 'bloqueado').length
    };

    const renderStars = (rating) => {
        const stars = parseInt(rating) || 0;
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i <= stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de Fornecedores</h1>
                    <p className="text-gray-500 mt-1">Cadastro e qualificação de fornecedores</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                    Novo Fornecedor
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg">
                            <Building2 className="text-gray-600" size={20} />
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
                            <p className="text-sm text-green-600">Ativos</p>
                            <p className="text-2xl font-bold text-green-700">{stats.ativos}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-yellow-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <AlertCircle className="text-yellow-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-yellow-600">Em Avaliação</p>
                            <p className="text-2xl font-bold text-yellow-700">{stats.emAvaliacao}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-red-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertCircle className="text-red-600" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-red-600">Bloqueados</p>
                            <p className="text-2xl font-bold text-red-700">{stats.bloqueados}</p>
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
                        placeholder="Buscar por razão social, nome ou CNPJ..."
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
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Fornecedor</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">CNPJ</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Categoria</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Avaliação</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Contato</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-500">
                                        <Users className="mx-auto mb-3 text-gray-300" size={48} />
                                        <p>Nenhum fornecedor encontrado</p>
                                        <Button variant="ghost" className="mt-3" onClick={() => setIsModalOpen(true)}>
                                            Cadastrar primeiro fornecedor
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6">
                                            <p className="font-medium text-gray-900">{item.nomeFantasia || item.razaoSocial}</p>
                                            {item.nomeFantasia && (
                                                <p className="text-sm text-gray-500">{item.razaoSocial}</p>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-mono text-gray-600">{item.cnpj || '-'}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-gray-600 capitalize">
                                                {CATEGORY_OPTIONS.find(c => c.value === item.categoria)?.label || '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {renderStars(item.avaliacao)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`badge ${getStatusColor(item.status)}`}>
                                                {getStatusLabel(item.status)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-gray-600">{item.contato || '-'}</p>
                                            <p className="text-sm text-gray-400">{item.telefone}</p>
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
                title={selectedItem ? 'Editar Fornecedor' : 'Novo Fornecedor'}
                size="xl"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit}>
                            {selectedItem ? 'Salvar Alterações' : 'Cadastrar'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Razão Social"
                            placeholder="Nome da empresa"
                            value={formData.razaoSocial}
                            onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                            required
                        />
                        <Input
                            label="Nome Fantasia"
                            placeholder="Nome fantasia"
                            value={formData.nomeFantasia}
                            onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="CNPJ"
                            placeholder="00.000.000/0000-00"
                            value={formData.cnpj}
                            onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                        />
                        <Input
                            label="E-mail"
                            type="email"
                            placeholder="email@exemplo.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <Input
                            label="Telefone"
                            placeholder="(00) 00000-0000"
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Endereço"
                        placeholder="Endereço completo"
                        value={formData.endereco}
                        onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Cidade"
                            placeholder="Cidade"
                            value={formData.cidade}
                            onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                        />
                        <Input
                            label="Estado"
                            placeholder="UF"
                            value={formData.estado}
                            onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <Select
                            label="Avaliação"
                            options={RATING_OPTIONS}
                            value={formData.avaliacao}
                            onChange={(e) => setFormData({ ...formData, avaliacao: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Pessoa de Contato"
                        placeholder="Nome do contato"
                        value={formData.contato}
                        onChange={(e) => setFormData({ ...formData, contato: e.target.value })}
                    />

                    <Textarea
                        label="Observações"
                        placeholder="Observações sobre o fornecedor"
                        value={formData.observacoes}
                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
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
                title="Detalhes do Fornecedor"
                size="lg"
            >
                {selectedItem && (
                    <div className="space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {selectedItem.nomeFantasia || selectedItem.razaoSocial}
                                </h3>
                                {selectedItem.nomeFantasia && (
                                    <p className="text-gray-500">{selectedItem.razaoSocial}</p>
                                )}
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={`badge ${getStatusColor(selectedItem.status)}`}>
                                        {getStatusLabel(selectedItem.status)}
                                    </span>
                                    {renderStars(selectedItem.avaliacao)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" />
                                <span className="text-sm">{selectedItem.email || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-400" />
                                <span className="text-sm">{selectedItem.telefone || '-'}</span>
                            </div>
                            <div className="flex items-start gap-2 col-span-2">
                                <MapPin size={16} className="text-gray-400 mt-0.5" />
                                <span className="text-sm">
                                    {selectedItem.endereco ? `${selectedItem.endereco}, ${selectedItem.cidade} - ${selectedItem.estado}` : '-'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">CNPJ</p>
                                <p className="font-mono">{selectedItem.cnpj || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Categoria</p>
                                <p className="capitalize">{CATEGORY_OPTIONS.find(c => c.value === selectedItem.categoria)?.label || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Contato</p>
                                <p>{selectedItem.contato || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Cadastrado em</p>
                                <p>{new Date(selectedItem.createdAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                        </div>

                        {selectedItem.observacoes && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Observações</p>
                                <p className="text-gray-700">{selectedItem.observacoes}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Fornecedores;
