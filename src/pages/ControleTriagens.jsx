// Controle de Triagens e Destinação - Triage and Destination Control Module
import { useState, useEffect, useMemo } from 'react';
import {
    Plus, Search, Eye, Edit, Trash2, Scale, Package, Recycle, Truck,
    AlertCircle, TrendingUp, TrendingDown, BarChart3, Upload, X, Image
} from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';
import { useAuth } from '../contexts/AuthContext';

const ORIGEM_OPTIONS = [
    { value: 'retornado_cliente', label: 'Retornado de Cliente' },
    { value: 'retrabalho_interno', label: 'Retrabalho Interno' },
    { value: 'retorno_fornecedor', label: 'Retorno de Fornecedor' },
    { value: 'sobra_estoque', label: 'Sobra de Estoque' },
    { value: 'nao_conformidade', label: 'Não Conformidade' },
    { value: 'residuo_operacional', label: 'Resíduo Operacional' }
];

const DESTINACAO_OPTIONS = [
    { value: 'reutilizacao_interna', label: 'Reutilização Interna' },
    { value: 'reutilizacao_cliente', label: 'Reutilização Cliente' },
    { value: 'recarga', label: 'Recarga' },
    { value: 'retrabalho_interno', label: 'Retrabalho Interno' },
    { value: 'devolucao_fornecedor', label: 'Devolução ao Fornecedor' },
    { value: 'descarte_comum', label: 'Descarte Comum' },
    { value: 'residuo_perigoso', label: 'Resíduo Perigoso' },
    { value: 'logistica_reversa', label: 'Logística Reversa / Coleta Ambiental' },
    { value: 'venda_sucata', label: 'Venda de Sucata' }
];

const ControleTriagens = () => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOrigem, setFilterOrigem] = useState('');
    const [filterDestinacao, setFilterDestinacao] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        produtoId: '',
        origem: '',
        descricaoTecnica: '',
        responsavel: '',
        dataTriagem: '',
        pesoBruto: '',
        pesoMomento: '',
        pesoVazio: '',
        pesoLiquido: '',
        percentualPerda: '',
        tipoDestinacao: '',
        empresaDestinacao: '',
        documentoDestinacao: '',
        custoReceita: '',
        observacoes: '',
        evidencias: []
    });

    useEffect(() => {
        loadItems();
        loadProdutos();
    }, []);

    const loadItems = () => setItems(storage.getAll(STORAGE_KEYS.TRIAGENS));
    const loadProdutos = () => setProdutos(storage.getAll(STORAGE_KEYS.PRODUTOS));

    // Get selected product data
    const selectedProduto = useMemo(() => {
        return produtos.find(p => p.id === parseInt(formData.produtoId)) || null;
    }, [formData.produtoId, produtos]);

    // Auto-fill weights when product is selected
    useEffect(() => {
        if (selectedProduto) {
            setFormData(prev => ({
                ...prev,
                pesoBruto: selectedProduto.pesoLiquido || '', // Peso Cheio do produto
                pesoVazio: selectedProduto.pesoVazio || ''
            }));
        }
    }, [selectedProduto]);

    // Calculate peso liquido and percentual perda
    const calculatedValues = useMemo(() => {
        const pesoMomento = parseFloat(formData.pesoMomento) || 0;
        const pesoVazio = parseFloat(formData.pesoVazio) || 0;
        const pesoBruto = parseFloat(formData.pesoBruto) || 0;

        const pesoLiquido = pesoMomento > 0 ? (pesoMomento - pesoVazio) : 0;
        const pesoLiquidoOriginal = pesoBruto > 0 ? (pesoBruto - pesoVazio) : 0;

        let percentualPerda = 0;
        if (pesoLiquidoOriginal > 0 && pesoLiquido >= 0) {
            percentualPerda = ((pesoLiquidoOriginal - pesoLiquido) / pesoLiquidoOriginal) * 100;
        }

        return {
            pesoLiquido: pesoLiquido.toFixed(3),
            percentualPerda: percentualPerda.toFixed(2)
        };
    }, [formData.pesoMomento, formData.pesoVazio, formData.pesoBruto]);

    const handleSubmit = () => {
        if (!formData.produtoId) {
            alert('Selecione um produto');
            return;
        }
        if (!formData.origem) {
            alert('Selecione a origem da triagem');
            return;
        }

        const produto = produtos.find(p => p.id === parseInt(formData.produtoId));

        const dataToSave = {
            ...formData,
            produtoNome: produto?.nome || '',
            produtoCodigo: produto?.codigo || '',
            responsavel: user?.name || 'Usuário',
            dataTriagem: new Date().toISOString(),
            pesoLiquido: calculatedValues.pesoLiquido,
            percentualPerda: calculatedValues.percentualPerda
        };

        if (selectedItem) {
            storage.update(STORAGE_KEYS.TRIAGENS, selectedItem.id, dataToSave);
        } else {
            storage.add(STORAGE_KEYS.TRIAGENS, dataToSave);
        }

        loadItems();
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setFormData({
            produtoId: '',
            origem: '',
            descricaoTecnica: '',
            responsavel: '',
            dataTriagem: '',
            pesoBruto: '',
            pesoMomento: '',
            pesoVazio: '',
            pesoLiquido: '',
            percentualPerda: '',
            tipoDestinacao: '',
            empresaDestinacao: '',
            documentoDestinacao: '',
            custoReceita: '',
            observacoes: '',
            evidencias: []
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

    const handleDelete = (id) => {
        if (confirm('Deseja realmente excluir esta triagem?')) {
            storage.delete(STORAGE_KEYS.TRIAGENS, id);
            loadItems();
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (formData.evidencias.length + files.length > 5) {
            alert('Máximo de 5 imagens permitidas');
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData(prev => ({
                    ...prev,
                    evidencias: [...prev.evidencias, event.target.result]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            evidencias: prev.evidencias.filter((_, i) => i !== index)
        }));
    };

    // Filter items
    const filteredItems = items.filter(item => {
        const matchesSearch =
            item.produtoNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.produtoCodigo?.includes(searchTerm);
        const matchesOrigem = !filterOrigem || item.origem === filterOrigem;
        const matchesDestinacao = !filterDestinacao || item.tipoDestinacao === filterDestinacao;
        return matchesSearch && matchesOrigem && matchesDestinacao;
    });

    // Statistics
    const stats = useMemo(() => {
        const total = items.length;
        const porOrigem = ORIGEM_OPTIONS.map(o => ({
            ...o,
            count: items.filter(i => i.origem === o.value).length
        }));
        const porDestinacao = DESTINACAO_OPTIONS.map(d => ({
            ...d,
            count: items.filter(i => i.tipoDestinacao === d.value).length
        }));

        // Reaproveitamento vs Descarte
        const reaproveitamento = items.filter(i =>
            ['reutilizacao_interna', 'reutilizacao_cliente', 'recarga', 'retrabalho_interno'].includes(i.tipoDestinacao)
        ).length;
        const descarte = items.filter(i =>
            ['descarte_comum', 'residuo_perigoso'].includes(i.tipoDestinacao)
        ).length;

        // Média de perda
        const perdas = items.map(i => parseFloat(i.percentualPerda) || 0);
        const mediaPerdas = perdas.length > 0 ? (perdas.reduce((a, b) => a + b, 0) / perdas.length).toFixed(2) : 0;

        // Custo total
        const custoTotal = items.reduce((acc, i) => {
            const valor = parseFloat(i.custoReceita) || 0;
            return acc + valor;
        }, 0);

        return {
            total,
            porOrigem,
            porDestinacao,
            reaproveitamento,
            descarte,
            mediaPerdas,
            custoTotal,
            percentualReaproveitamento: total > 0 ? ((reaproveitamento / total) * 100).toFixed(1) : 0,
            percentualDescarte: total > 0 ? ((descarte / total) * 100).toFixed(1) : 0
        };
    }, [items]);

    const getOrigemLabel = (value) => ORIGEM_OPTIONS.find(o => o.value === value)?.label || value;
    const getDestinacaoLabel = (value) => DESTINACAO_OPTIONS.find(d => d.value === value)?.label || value;

    const getDestinacaoColor = (tipo) => {
        const reaproveitamento = ['reutilizacao_interna', 'reutilizacao_cliente', 'recarga', 'retrabalho_interno'];
        const descarte = ['descarte_comum', 'residuo_perigoso'];

        if (reaproveitamento.includes(tipo)) return 'bg-green-100 text-green-700';
        if (descarte.includes(tipo)) return 'bg-red-100 text-red-700';
        return 'bg-blue-100 text-blue-700';
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Controle de Triagens e Destinação</h1>
                    <p className="text-gray-500 mt-1">Registro, classificação e destinação final de itens</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsDashboardOpen(true)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-700 transition-colors"
                    >
                        <BarChart3 size={18} />
                        Indicadores
                    </button>
                    <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                        Nova Triagem
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg"><Package className="text-gray-600" size={20} /></div>
                        <div><p className="text-sm text-gray-500">Total Triagens</p><p className="text-2xl font-bold">{stats.total}</p></div>
                    </div>
                </Card>
                <Card className="bg-green-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg"><Recycle className="text-green-600" size={20} /></div>
                        <div><p className="text-sm text-green-600">Reaproveitamento</p><p className="text-2xl font-bold text-green-700">{stats.percentualReaproveitamento}%</p></div>
                    </div>
                </Card>
                <Card className="bg-red-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg"><Trash2 className="text-red-600" size={20} /></div>
                        <div><p className="text-sm text-red-600">Descarte</p><p className="text-2xl font-bold text-red-700">{stats.percentualDescarte}%</p></div>
                    </div>
                </Card>
                <Card className="bg-yellow-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg"><TrendingDown className="text-yellow-600" size={20} /></div>
                        <div><p className="text-sm text-yellow-600">Média Perdas</p><p className="text-2xl font-bold text-yellow-700">{stats.mediaPerdas}%</p></div>
                    </div>
                </Card>
                <Card className="bg-blue-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg"><Scale className="text-blue-600" size={20} /></div>
                        <div><p className="text-sm text-blue-600">Custo/Receita</p><p className="text-2xl font-bold text-blue-700">R$ {stats.custoTotal.toFixed(2)}</p></div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por produto ou código..."
                        className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select
                    placeholder="Filtrar por origem"
                    options={ORIGEM_OPTIONS}
                    value={filterOrigem}
                    onChange={(e) => setFilterOrigem(e.target.value)}
                    containerClassName="w-full md:w-56"
                />
                <Select
                    placeholder="Filtrar por destinação"
                    options={DESTINACAO_OPTIONS}
                    value={filterDestinacao}
                    onChange={(e) => setFilterDestinacao(e.target.value)}
                    containerClassName="w-full md:w-56"
                />
            </div>

            {/* Table */}
            <Card padding="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Produto</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Origem</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Peso Líquido</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">% Perda</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Destinação</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Data</th>
                                <th className="text-right py-4 px-4 font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-500">
                                        <Package className="mx-auto mb-3 text-gray-300" size={48} />
                                        <p>Nenhuma triagem registrada</p>
                                        <Button variant="ghost" className="mt-3" onClick={() => setIsModalOpen(true)}>
                                            Registrar primeira triagem
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-gray-900">{item.produtoNome}</p>
                                            <p className="text-sm text-gray-500">#{item.produtoCodigo}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm">{getOrigemLabel(item.origem)}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-mono">{item.pesoLiquido} kg</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`font-semibold ${parseFloat(item.percentualPerda) > 10 ? 'text-red-600' : 'text-gray-600'}`}>
                                                {item.percentualPerda}%
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getDestinacaoColor(item.tipoDestinacao)}`}>
                                                {getDestinacaoLabel(item.tipoDestinacao)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500">
                                            {new Date(item.dataTriagem || item.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-end gap-1">
                                                <button onClick={() => handleView(item)} className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Eye size={16} className="text-gray-500" />
                                                </button>
                                                <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Edit size={16} className="text-gray-500" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg">
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
                title={selectedItem ? 'Editar Triagem' : 'Nova Triagem'}
                size="xl"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit}>{selectedItem ? 'Salvar Alterações' : 'Registrar Triagem'}</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    {/* Produto Selection */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Package size={16} /> Produto
                        </h3>
                        <Select
                            label="Selecione o Produto"
                            options={produtos.map(p => ({ value: p.id.toString(), label: `${p.codigo} - ${p.nome}` }))}
                            value={formData.produtoId}
                            onChange={(e) => setFormData({ ...formData, produtoId: e.target.value })}
                            required
                        />
                        {selectedProduto && (
                            <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                                <strong>{selectedProduto.nome}</strong> - Peso Cheio: {selectedProduto.pesoLiquido || '-'} kg | Peso Vazio: {selectedProduto.pesoVazio || '-'} kg
                            </div>
                        )}
                    </div>

                    {/* Origem */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <AlertCircle size={16} /> Origem da Triagem
                        </h3>
                        <Select
                            label="Origem"
                            options={ORIGEM_OPTIONS}
                            value={formData.origem}
                            onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                            required
                        />
                    </div>

                    {/* Dados Técnicos */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Dados da Triagem Técnica</h3>
                        <Textarea
                            label="Descrição Técnica da Avaliação"
                            placeholder="Descreva os detalhes técnicos da triagem realizada"
                            value={formData.descricaoTecnica}
                            onChange={(e) => setFormData({ ...formData, descricaoTecnica: e.target.value })}
                            rows={3}
                        />
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                                <div className="h-12 px-4 bg-gray-100 border border-gray-200 rounded-lg flex items-center text-gray-600">
                                    {user?.name || 'Usuário logado'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Data e Hora</label>
                                <div className="h-12 px-4 bg-gray-100 border border-gray-200 rounded-lg flex items-center text-gray-600">
                                    {new Date().toLocaleString('pt-BR')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controle de Peso */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Scale size={16} /> Controle de Peso e Perdas
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Peso Bruto (Cheio)</label>
                                <div className="h-12 px-4 bg-gray-100 border border-gray-200 rounded-lg flex items-center text-gray-600">
                                    {formData.pesoBruto || '-'} kg
                                </div>
                            </div>
                            <Input
                                label="Peso no Momento (balança)"
                                type="number"
                                step="0.001"
                                placeholder="0.000"
                                value={formData.pesoMomento}
                                onChange={(e) => setFormData({ ...formData, pesoMomento: e.target.value })}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Peso Vazio (Tara)</label>
                                <div className="h-12 px-4 bg-gray-100 border border-gray-200 rounded-lg flex items-center text-gray-600">
                                    {formData.pesoVazio || '-'} kg
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Peso Líquido</label>
                                <div className="h-12 px-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center text-blue-700 font-semibold">
                                    {calculatedValues.pesoLiquido} kg
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Percentual de Perda</label>
                            <div className={`h-12 px-4 rounded-lg flex items-center font-semibold ${parseFloat(calculatedValues.percentualPerda) > 10
                                    ? 'bg-red-50 border border-red-200 text-red-700'
                                    : 'bg-green-50 border border-green-200 text-green-700'
                                }`}>
                                {calculatedValues.percentualPerda}%
                            </div>
                        </div>
                    </div>

                    {/* Destinação */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Truck size={16} /> Destinação Final
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Tipo de Destinação"
                                options={DESTINACAO_OPTIONS}
                                value={formData.tipoDestinacao}
                                onChange={(e) => setFormData({ ...formData, tipoDestinacao: e.target.value })}
                            />
                            <Input
                                label="Empresa Responsável"
                                placeholder="Nome da empresa de destinação"
                                value={formData.empresaDestinacao}
                                onChange={(e) => setFormData({ ...formData, empresaDestinacao: e.target.value })}
                            />
                            <Input
                                label="Documento/Certificado"
                                placeholder="Número do documento"
                                value={formData.documentoDestinacao}
                                onChange={(e) => setFormData({ ...formData, documentoDestinacao: e.target.value })}
                            />
                            <Input
                                label="Custo ou Receita (R$)"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={formData.custoReceita}
                                onChange={(e) => setFormData({ ...formData, custoReceita: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Observações */}
                    <Textarea
                        label="Observações"
                        placeholder="Observações adicionais"
                        value={formData.observacoes}
                        onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                        rows={2}
                    />

                    {/* Evidências */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Image size={16} /> Evidências (máx. 5 imagens)
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {formData.evidencias.map((img, idx) => (
                                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                                    <img src={img} alt={`Evidência ${idx + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {formData.evidencias.length < 5 && (
                                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                    <Upload size={20} className="text-gray-400" />
                                    <span className="text-xs text-gray-400 mt-1">Adicionar</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => { setIsViewModalOpen(false); setSelectedItem(null); }}
                title="Detalhes da Triagem"
                size="lg"
            >
                {selectedItem && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <Package className="text-gray-600" size={32} />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{selectedItem.produtoNome}</h3>
                                <p className="text-sm text-gray-500">#{selectedItem.produtoCodigo}</p>
                            </div>
                            <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getDestinacaoColor(selectedItem.tipoDestinacao)}`}>
                                {getDestinacaoLabel(selectedItem.tipoDestinacao)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Origem</p>
                                <p className="font-medium">{getOrigemLabel(selectedItem.origem)}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Responsável</p>
                                <p className="font-medium">{selectedItem.responsavel}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Peso Líquido</p>
                                <p className="font-medium font-mono">{selectedItem.pesoLiquido} kg</p>
                            </div>
                            <div className={`p-3 rounded-lg ${parseFloat(selectedItem.percentualPerda) > 10 ? 'bg-red-50' : 'bg-green-50'}`}>
                                <p className={`text-sm ${parseFloat(selectedItem.percentualPerda) > 10 ? 'text-red-600' : 'text-green-600'}`}>Perda</p>
                                <p className={`font-bold ${parseFloat(selectedItem.percentualPerda) > 10 ? 'text-red-700' : 'text-green-700'}`}>{selectedItem.percentualPerda}%</p>
                            </div>
                        </div>

                        {selectedItem.descricaoTecnica && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Descrição Técnica</p>
                                <p className="text-gray-700">{selectedItem.descricaoTecnica}</p>
                            </div>
                        )}

                        {selectedItem.evidencias?.length > 0 && (
                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Evidências</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedItem.evidencias.map((img, idx) => (
                                        <img key={idx} src={img} alt={`Evidência ${idx + 1}`} className="w-20 h-20 rounded-lg object-cover" />
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="text-sm text-gray-400 pt-4 border-t">
                            Registrado em: {new Date(selectedItem.dataTriagem || selectedItem.createdAt).toLocaleString('pt-BR')}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Dashboard Modal */}
            <Modal
                isOpen={isDashboardOpen}
                onClose={() => setIsDashboardOpen(false)}
                title="Indicadores de Triagem"
                size="xl"
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg text-center">
                            <p className="text-3xl font-bold text-blue-700">{stats.total}</p>
                            <p className="text-sm text-blue-600">Total Triagens</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                            <p className="text-3xl font-bold text-green-700">{stats.percentualReaproveitamento}%</p>
                            <p className="text-sm text-green-600">Reaproveitamento</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg text-center">
                            <p className="text-3xl font-bold text-red-700">{stats.percentualDescarte}%</p>
                            <p className="text-sm text-red-600">Descarte</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg text-center">
                            <p className="text-3xl font-bold text-yellow-700">{stats.mediaPerdas}%</p>
                            <p className="text-sm text-yellow-600">Média Perdas</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Por Origem</h4>
                            <div className="space-y-2">
                                {stats.porOrigem.filter(o => o.count > 0).map(item => (
                                    <div key={item.value} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-700">{item.label}</span>
                                        <span className="font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Por Destinação</h4>
                            <div className="space-y-2">
                                {stats.porDestinacao.filter(d => d.count > 0).map(item => (
                                    <div key={item.value} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-700">{item.label}</span>
                                        <span className={`font-bold px-2 py-0.5 rounded ${getDestinacaoColor(item.value)}`}>{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ControleTriagens;
