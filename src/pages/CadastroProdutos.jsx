// Cadastro de Produtos - Product Registration Module
import { useState, useEffect, useMemo } from 'react';
import { Plus, Package, Search, Edit, Trash2, Eye, Copy, BarChart3 } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const UNIDADE_MEDIDA_OPTIONS = [
    { value: 'un', label: 'Unidade (un)' },
    { value: 'kg', label: 'Quilograma (kg)' },
    { value: 'g', label: 'Grama (g)' },
    { value: 'l', label: 'Litro (L)' },
    { value: 'ml', label: 'Mililitro (mL)' },
    { value: 'pç', label: 'Peça (pç)' },
    { value: 'cx', label: 'Caixa (cx)' },
    { value: 'pct', label: 'Pacote (pct)' },
    { value: 'm', label: 'Metro (m)' },
    { value: 'm²', label: 'Metro Quadrado (m²)' },
    { value: 'm³', label: 'Metro Cúbico (m³)' }
];

const STATUS_OPTIONS = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'descontinuado', label: 'Descontinuado' }
];

const CATEGORIA_OPTIONS = [
    { value: 'materia_prima', label: 'Matéria Prima' },
    { value: 'produto_acabado', label: 'Produto Acabado' },
    { value: 'semi_acabado', label: 'Semi-Acabado' },
    { value: 'embalagem', label: 'Embalagem' },
    { value: 'insumo', label: 'Insumo' },
    { value: 'componente', label: 'Componente' },
    { value: 'outros', label: 'Outros' }
];

// Função para gerar código numérico automático
const generateProductCode = (existingItems) => {
    const maxCode = existingItems.reduce((max, item) => {
        const code = parseInt(item.codigo) || 0;
        return code > max ? code : max;
    }, 0);
    return String(maxCode + 1).padStart(6, '0');
};

// Função para gerar SKU
const generateSKU = (nome, categoria) => {
    const prefix = categoria ? categoria.substring(0, 3).toUpperCase() : 'PRD';
    const nameCode = nome ? nome.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X') : 'XXX';
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `${prefix}-${nameCode}-${random}`;
};

const CadastroProdutos = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        codigo: '',
        sku: '',
        nome: '',
        descricao: '',
        categoria: '',
        unidadeMedida: 'un',
        pesoLiquido: '',
        pesoBruto: '',
        pesoVazio: '',
        gramatura: '',
        capacidadeProducao: '',
        precoUnitario: '',
        status: 'ativo',
        observacoes: ''
    });

    useEffect(() => { loadItems(); }, []);

    const loadItems = () => {
        const data = storage.getAll(STORAGE_KEYS.PRODUTOS);
        setItems(data);
    };

    // Labels dinâmicas baseadas na unidade de medida
    const getDynamicLabels = (unidade) => {
        switch (unidade) {
            case 'kg':
            case 'g':
                return {
                    pesoBruto: 'Peso Bruto (kg)',
                    pesoCheio: 'Peso Cheio (kg)',
                    pesoVazio: 'Peso Vazio (kg)',
                    capacidade: 'Capacidade de Produção (kg/dia)',
                    precoProducao: 'Custo por kg'
                };
            case 'l':
            case 'ml':
                return {
                    pesoBruto: 'Volume Total (L)',
                    pesoCheio: 'Volume Cheio (L)',
                    pesoVazio: 'Volume Vazio (L)',
                    capacidade: 'Capacidade de Produção (L/dia)',
                    precoProducao: 'Custo por Litro'
                };
            case 'm':
            case 'm²':
            case 'm³':
                return {
                    pesoBruto: 'Dimensão Total',
                    pesoCheio: 'Dimensão Principal',
                    pesoVazio: 'Margem/Sobra',
                    capacidade: 'Capacidade de Produção (un/dia)',
                    precoProducao: 'Custo por Metro'
                };
            default:
                return {
                    pesoBruto: 'Peso Bruto (kg)',
                    pesoCheio: 'Peso Cheio (kg)',
                    pesoVazio: 'Peso Vazio (kg)',
                    capacidade: 'Capacidade de Produção (un/dia)',
                    precoProducao: 'Custo por Unidade Produzida'
                };
        }
    };

    // Tooltips explicativos para os campos de peso
    const weightTooltips = {
        pesoBruto: 'Peso total do produto incluindo embalagem e todos os componentes',
        pesoCheio: 'Peso do recipiente/embalagem cheio de produto',
        pesoVazio: 'Peso do recipiente/embalagem vazio (tara)'
    };

    const labels = getDynamicLabels(formData.unidadeMedida);

    // Cálculo automático da gramatura (Peso Cheio - Peso Vazio)
    const gramaturaCalculada = useMemo(() => {
        const pesoCheio = parseFloat(formData.pesoLiquido) || 0; // pesoLiquido é usado internamente como Peso Cheio
        const pesoVazio = parseFloat(formData.pesoVazio) || 0;
        if (pesoCheio === 0 || pesoVazio === 0) return '';
        const result = pesoCheio - pesoVazio;
        return result > 0 ? result.toFixed(3) : '';
    }, [formData.pesoLiquido, formData.pesoVazio]);

    // Cálculo do preço por produção
    const precoProducao = useMemo(() => {
        const preco = parseFloat(formData.precoUnitario) || 0;
        const capacidade = parseFloat(formData.capacidadeProducao) || 1;
        if (capacidade === 0) return 0;
        return (preco / capacidade).toFixed(4);
    }, [formData.precoUnitario, formData.capacidadeProducao]);

    const handleSubmit = () => {
        let dataToSave = { ...formData };

        // Auto-gerar código se não informado
        if (!dataToSave.codigo) {
            dataToSave.codigo = generateProductCode(items);
        }

        // Auto-gerar SKU se não informado
        if (!dataToSave.sku) {
            dataToSave.sku = generateSKU(dataToSave.nome, dataToSave.categoria);
        }

        // Salvar preço de produção calculado
        dataToSave.precoProducao = precoProducao;

        if (selectedItem) {
            storage.update(STORAGE_KEYS.PRODUTOS, selectedItem.id, dataToSave);
        } else {
            storage.add(STORAGE_KEYS.PRODUTOS, dataToSave);
        }

        loadItems();
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setFormData({
            codigo: '', sku: '', nome: '', descricao: '', categoria: '', unidadeMedida: 'un',
            pesoLiquido: '', pesoBruto: '', pesoVazio: '', gramatura: '', capacidadeProducao: '',
            precoUnitario: '', status: 'ativo', observacoes: ''
        });
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setFormData({ ...item });
        setIsModalOpen(true);
    };

    const handleView = (item) => {
        setSelectedItem(item);
        setIsViewModalOpen(true);
    };

    const handleDuplicate = (item) => {
        const newItem = {
            ...item,
            codigo: '',
            sku: '',
            nome: `${item.nome} (Cópia)`
        };
        delete newItem.id;
        delete newItem.createdAt;
        delete newItem.updatedAt;
        setFormData(newItem);
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ativo': return 'bg-green-100 text-green-700';
            case 'inativo': return 'bg-gray-100 text-gray-700';
            case 'descontinuado': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch =
            item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.codigo?.includes(searchTerm) ||
            item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategoria = !categoriaFilter || item.categoria === categoriaFilter;
        return matchesSearch && matchesCategoria;
    });

    const stats = {
        total: items.length,
        ativos: items.filter(i => i.status === 'ativo').length,
        inativos: items.filter(i => i.status === 'inativo').length
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cadastro de Produtos</h1>
                    <p className="text-gray-500 mt-1">Gerenciamento de produtos para controle de qualidade e descartes</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Novo Produto</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg"><Package className="text-gray-600" size={20} /></div>
                        <div><p className="text-sm text-gray-500">Total de Produtos</p><p className="text-2xl font-bold">{stats.total}</p></div>
                    </div>
                </Card>
                <Card className="bg-green-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg"><Package className="text-green-600" size={20} /></div>
                        <div><p className="text-sm text-green-600">Produtos Ativos</p><p className="text-2xl font-bold text-green-700">{stats.ativos}</p></div>
                    </div>
                </Card>
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg"><Package className="text-gray-500" size={20} /></div>
                        <div><p className="text-sm text-gray-500">Inativos</p><p className="text-2xl font-bold">{stats.inativos}</p></div>
                    </div>
                </Card>
                <Card className="bg-blue-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg"><BarChart3 className="text-blue-600" size={20} /></div>
                        <div><p className="text-sm text-blue-600">Categorias</p><p className="text-2xl font-bold text-blue-700">{new Set(items.map(i => i.categoria)).size}</p></div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome, código ou SKU..."
                        className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select
                    placeholder="Todas as categorias"
                    options={CATEGORIA_OPTIONS}
                    value={categoriaFilter}
                    onChange={(e) => setCategoriaFilter(e.target.value)}
                    containerClassName="w-full md:w-56"
                />
            </div>

            {/* Table */}
            <Card padding="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Código</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">SKU</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Produto</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Categoria</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Un. Medida</th>
                                <th className="text-right py-4 px-4 font-semibold text-gray-700">Preço Unit.</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                                <th className="text-right py-4 px-4 font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-gray-500">
                                        <Package className="mx-auto mb-3 text-gray-300" size={48} />
                                        <p>Nenhum produto cadastrado</p>
                                        <Button variant="ghost" className="mt-3" onClick={() => setIsModalOpen(true)}>
                                            Cadastrar primeiro produto
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <span className="font-mono text-blue-600 font-medium">#{item.codigo}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-mono text-sm text-gray-600">{item.sku}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-gray-900">{item.nome}</p>
                                            {item.descricao && <p className="text-sm text-gray-500 truncate max-w-xs">{item.descricao}</p>}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm capitalize">
                                                {CATEGORIA_OPTIONS.find(c => c.value === item.categoria)?.label || '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm uppercase">{item.unidadeMedida}</span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <span className="font-medium">{formatCurrency(item.precoUnitario)}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                                                {STATUS_OPTIONS.find(s => s.value === item.status)?.label}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => handleView(item)} className="p-2 hover:bg-gray-100 rounded-lg" title="Visualizar">
                                                    <Eye size={16} className="text-gray-500" />
                                                </button>
                                                <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg" title="Editar">
                                                    <Edit size={16} className="text-gray-500" />
                                                </button>
                                                <button onClick={() => handleDuplicate(item)} className="p-2 hover:bg-gray-100 rounded-lg" title="Duplicar">
                                                    <Copy size={16} className="text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => { if (confirm('Excluir produto?')) { storage.delete(STORAGE_KEYS.PRODUTOS, item.id); loadItems(); } }}
                                                    className="p-2 hover:bg-red-50 rounded-lg" title="Excluir"
                                                >
                                                    <Trash2 size={16} className="text-red-500" />
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
                title={selectedItem ? 'Editar Produto' : 'Novo Produto'}
                size="xl"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit}>{selectedItem ? 'Salvar Alterações' : 'Cadastrar Produto'}</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    {/* Identificação */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Package size={16} /> Identificação do Produto
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Código do Produto"
                                placeholder="Auto-gerado se vazio"
                                value={formData.codigo}
                                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                            />
                            <Input
                                label="SKU"
                                placeholder="Auto-gerado se vazio"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                            />
                            <Select
                                label="Status"
                                options={STATUS_OPTIONS}
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Informações Básicas */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Informações Básicas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nome do Produto"
                                placeholder="Nome do produto"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                required
                            />
                            <Select
                                label="Categoria"
                                options={CATEGORIA_OPTIONS}
                                value={formData.categoria}
                                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            />
                        </div>
                        <div className="mt-4">
                            <Textarea
                                label="Descrição"
                                placeholder="Descrição detalhada do produto"
                                value={formData.descricao}
                                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                                rows={2}
                            />
                        </div>
                    </div>

                    {/* Unidade e Medidas */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Unidade e Medidas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Select
                                label="Unidade de Medida"
                                options={UNIDADE_MEDIDA_OPTIONS}
                                value={formData.unidadeMedida}
                                onChange={(e) => setFormData({ ...formData, unidadeMedida: e.target.value })}
                            />
                            <Input
                                label={labels.pesoBruto}
                                tooltip={weightTooltips.pesoBruto}
                                type="number"
                                step="0.001"
                                placeholder="0.000"
                                value={formData.pesoBruto}
                                onChange={(e) => setFormData({ ...formData, pesoBruto: e.target.value })}
                            />
                            <Input
                                label={labels.pesoCheio}
                                tooltip={weightTooltips.pesoCheio}
                                type="number"
                                step="0.001"
                                placeholder="0.000"
                                value={formData.pesoLiquido}
                                onChange={(e) => setFormData({ ...formData, pesoLiquido: e.target.value })}
                            />
                            <Input
                                label={labels.pesoVazio}
                                tooltip={weightTooltips.pesoVazio}
                                type="number"
                                step="0.001"
                                placeholder="0.000"
                                value={formData.pesoVazio}
                                onChange={(e) => setFormData({ ...formData, pesoVazio: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gramatura (calculada automaticamente)</label>
                                <div className="h-12 px-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
                                    <span className="text-blue-700 font-semibold">
                                        {gramaturaCalculada ? `${gramaturaCalculada} g` : 'Preencha Peso Cheio e Peso Vazio'}
                                    </span>
                                    <span className="text-blue-500 text-xs ml-2">(Peso Cheio - Peso Vazio)</span>
                                </div>
                            </div>
                            <Input
                                label={labels.capacidade}
                                type="number"
                                placeholder="0"
                                value={formData.capacidadeProducao}
                                onChange={(e) => setFormData({ ...formData, capacidadeProducao: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Preços */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Preços e Custos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="Preço Unitário (R$)"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.precoUnitario}
                                onChange={(e) => setFormData({ ...formData, precoUnitario: e.target.value })}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{labels.precoProducao}</label>
                                <div className="h-12 px-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
                                    <span className="text-blue-700 font-semibold">{formatCurrency(precoProducao)}</span>
                                    <span className="text-blue-500 text-sm ml-2">(calculado automaticamente)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Observações */}
                    <Textarea
                        label="Observações"
                        placeholder="Observações adicionais sobre o produto"
                        value={formData.observacoes}
                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                        rows={2}
                    />
                </div>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => { setIsViewModalOpen(false); setSelectedItem(null); }}
                title="Detalhes do Produto"
                size="lg"
            >
                {selectedItem && (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Package className="text-blue-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-blue-600">#{selectedItem.codigo}</span>
                                    <span className="text-gray-400">|</span>
                                    <span className="font-mono text-sm text-gray-500">{selectedItem.sku}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mt-1">{selectedItem.nome}</h3>
                                <p className="text-gray-500 text-sm mt-1">{selectedItem.descricao || 'Sem descrição'}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedItem.status)}`}>
                                {STATUS_OPTIONS.find(s => s.value === selectedItem.status)?.label}
                            </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Categoria</p>
                                <p className="font-medium capitalize">{CATEGORIA_OPTIONS.find(c => c.value === selectedItem.categoria)?.label || '-'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Unidade de Medida</p>
                                <p className="font-medium uppercase">{selectedItem.unidadeMedida}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Gramatura</p>
                                <p className="font-medium">{selectedItem.gramatura ? `${selectedItem.gramatura} g` : '-'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Peso Bruto</p>
                                <p className="font-medium">{selectedItem.pesoBruto ? `${selectedItem.pesoBruto} kg` : '-'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Peso Cheio</p>
                                <p className="font-medium">{selectedItem.pesoLiquido ? `${selectedItem.pesoLiquido} kg` : '-'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Peso Vazio</p>
                                <p className="font-medium">{selectedItem.pesoVazio ? `${selectedItem.pesoVazio} kg` : '-'}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-600">Gramatura (calculada)</p>
                                <p className="font-medium text-blue-700">
                                    {selectedItem.pesoLiquido && selectedItem.pesoVazio
                                        ? `${(parseFloat(selectedItem.pesoLiquido) - parseFloat(selectedItem.pesoVazio)).toFixed(3)} g`
                                        : '-'}
                                </p>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-600">Preço Unitário</p>
                                <p className="text-xl font-bold text-green-700">{formatCurrency(selectedItem.precoUnitario)}</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-600">Capacidade de Produção</p>
                                <p className="text-xl font-bold text-blue-700">{selectedItem.capacidadeProducao || '0'} un/dia</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <p className="text-sm text-purple-600">Custo por Unidade Produzida</p>
                                <p className="text-xl font-bold text-purple-700">{formatCurrency(selectedItem.precoProducao)}</p>
                            </div>
                        </div>

                        {selectedItem.observacoes && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Observações</p>
                                <p className="text-gray-700">{selectedItem.observacoes}</p>
                            </div>
                        )}

                        <div className="text-sm text-gray-400 pt-4 border-t">
                            Cadastrado em: {new Date(selectedItem.createdAt).toLocaleString('pt-BR')}
                            {selectedItem.updatedAt !== selectedItem.createdAt && (
                                <> | Atualizado em: {new Date(selectedItem.updatedAt).toLocaleString('pt-BR')}</>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CadastroProdutos;
