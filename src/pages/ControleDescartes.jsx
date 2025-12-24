// Controle de Descartes - Waste Management Module
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Eye, Scale, Box, Droplets, Cog, Leaf, Package } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const TIPO_DESCARTE_OPTIONS = [
    { value: 'unidade', label: 'Por Unidade', icon: Box },
    { value: 'peso', label: 'Por Peso', icon: Scale },
    { value: 'volume', label: 'Por Volume', icon: Droplets },
    { value: 'peca', label: 'Por Peça/Componente', icon: Cog },
    { value: 'processo', label: 'De Processo', icon: Package },
    { value: 'ambiental', label: 'Ambiental/Descarte', icon: Leaf }
];

const STATUS_OPTIONS = [
    { value: 'pendente', label: 'Pendente' },
    { value: 'em_analise', label: 'Em Análise' },
    { value: 'aprovado', label: 'Aprovado' },
    { value: 'descartado', label: 'Descartado' },
    { value: 'reciclado', label: 'Reciclado' }
];

const DESTINO_OPTIONS = [
    { value: 'reciclagem', label: 'Reciclagem' },
    { value: 'aterro', label: 'Aterro Sanitário' },
    { value: 'incineracao', label: 'Incineração' },
    { value: 'reuso', label: 'Reuso/Reaproveitamento' },
    { value: 'devolucao', label: 'Devolução ao Fornecedor' },
    { value: 'tratamento', label: 'Tratamento Especial' },
    { value: 'outro', label: 'Outro' }
];

const ControleDescartes = () => {
    const [items, setItems] = useState([]);
    const [activeTab, setActiveTab] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        tipoDescarte: 'unidade',
        produto: '',
        lote: '',
        quantidade: '',
        unidade: '',
        peso: '',
        volume: '',
        motivo: '',
        origem: '',
        destino: '',
        responsavel: '',
        dataDescarte: '',
        custoEstimado: '',
        status: 'pendente',
        certificadoDescarte: '',
        impactoAmbiental: '',
        observacoes: ''
    });

    useEffect(() => { loadItems(); }, []);
    const loadItems = () => setItems(storage.getAll(STORAGE_KEYS.DESCARTES));

    const handleSubmit = () => {
        if (selectedItem) storage.update(STORAGE_KEYS.DESCARTES, selectedItem.id, formData);
        else storage.add(STORAGE_KEYS.DESCARTES, formData);
        loadItems();
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setFormData({
            tipoDescarte: 'unidade', produto: '', lote: '', quantidade: '', unidade: '', peso: '', volume: '',
            motivo: '', origem: '', destino: '', responsavel: '', dataDescarte: '', custoEstimado: '',
            status: 'pendente', certificadoDescarte: '', impactoAmbiental: '', observacoes: ''
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'pendente': return 'bg-gray-100 text-gray-700';
            case 'em_analise': return 'bg-yellow-100 text-yellow-700';
            case 'aprovado': return 'bg-blue-100 text-blue-700';
            case 'descartado': return 'bg-red-100 text-red-700';
            case 'reciclado': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTipoIcon = (tipo) => {
        const option = TIPO_DESCARTE_OPTIONS.find(o => o.value === tipo);
        return option?.icon || Box;
    };

    const getTipoLabel = (tipo) => {
        const option = TIPO_DESCARTE_OPTIONS.find(o => o.value === tipo);
        return option?.label || tipo;
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.produto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.lote?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'todos' || item.tipoDescarte === activeTab;
        return matchesSearch && matchesTab;
    });

    const stats = {
        total: items.length,
        pendentes: items.filter(i => i.status === 'pendente').length,
        descartados: items.filter(i => i.status === 'descartado').length,
        reciclados: items.filter(i => i.status === 'reciclado').length
    };

    const statsByType = TIPO_DESCARTE_OPTIONS.map(tipo => ({
        ...tipo,
        count: items.filter(i => i.tipoDescarte === tipo.value).length
    }));

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Controle de Descartes</h1>
                    <p className="text-gray-500 mt-1">Gestão de descartes por tipo e destino</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Novo Descarte</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg"><Trash2 className="text-gray-600" size={20} /></div>
                        <div><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{stats.total}</p></div>
                    </div>
                </Card>
                <Card className="bg-yellow-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg"><Trash2 className="text-yellow-600" size={20} /></div>
                        <div><p className="text-sm text-yellow-600">Pendentes</p><p className="text-2xl font-bold text-yellow-700">{stats.pendentes}</p></div>
                    </div>
                </Card>
                <Card className="bg-red-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg"><Trash2 className="text-red-600" size={20} /></div>
                        <div><p className="text-sm text-red-600">Descartados</p><p className="text-2xl font-bold text-red-700">{stats.descartados}</p></div>
                    </div>
                </Card>
                <Card className="bg-green-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg"><Leaf className="text-green-600" size={20} /></div>
                        <div><p className="text-sm text-green-600">Reciclados</p><p className="text-2xl font-bold text-green-700">{stats.reciclados}</p></div>
                    </div>
                </Card>
            </div>

            {/* Type Tabs */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveTab('todos')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'todos' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Todos ({items.length})
                </button>
                {statsByType.map((tipo) => {
                    const Icon = tipo.icon;
                    return (
                        <button
                            key={tipo.value}
                            onClick={() => setActiveTab(tipo.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === tipo.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Icon size={16} />
                            {tipo.label} ({tipo.count})
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar por produto ou lote..."
                    className="w-full h-12 pl-4 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <Card padding="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Tipo</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Produto</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Lote</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Quantidade</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Destino</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-700">Data</th>
                                <th className="text-right py-4 px-6 font-semibold text-gray-700">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-gray-500">
                                        <Trash2 className="mx-auto mb-3 text-gray-300" size={48} />
                                        <p>Nenhum descarte encontrado</p>
                                        <Button variant="ghost" className="mt-3" onClick={() => setIsModalOpen(true)}>
                                            Registrar primeiro descarte
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => {
                                    const TypeIcon = getTipoIcon(item.tipoDescarte);
                                    return (
                                        <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <TypeIcon size={16} className="text-gray-500" />
                                                    <span className="text-sm">{getTipoLabel(item.tipoDescarte)}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 font-medium">{item.produto}</td>
                                            <td className="py-4 px-6 font-mono text-sm">{item.lote || '-'}</td>
                                            <td className="py-4 px-6 text-sm">
                                                {item.quantidade} {item.unidade}
                                                {item.peso && <span className="text-gray-400 ml-1">({item.peso} kg)</span>}
                                            </td>
                                            <td className="py-4 px-6 text-sm capitalize">
                                                {DESTINO_OPTIONS.find(d => d.value === item.destino)?.label || '-'}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                                                    {STATUS_OPTIONS.find(s => s.value === item.status)?.label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm">
                                                {item.dataDescarte ? new Date(item.dataDescarte).toLocaleDateString('pt-BR') : '-'}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleView(item)} className="p-2 hover:bg-gray-100 rounded-lg">
                                                        <Eye size={18} className="text-gray-500" />
                                                    </button>
                                                    <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg">
                                                        <Edit size={18} className="text-gray-500" />
                                                    </button>
                                                    <button
                                                        onClick={() => { if (confirm('Excluir?')) { storage.delete(STORAGE_KEYS.DESCARTES, item.id); loadItems(); } }}
                                                        className="p-2 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 size={18} className="text-red-500" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedItem ? 'Editar Descarte' : 'Novo Descarte'}
                size="xl"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Salvar</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    {/* Tipo de Descarte */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Descarte</label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {TIPO_DESCARTE_OPTIONS.map((tipo) => {
                                const Icon = tipo.icon;
                                return (
                                    <button
                                        key={tipo.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, tipoDescarte: tipo.value })}
                                        className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${formData.tipoDescarte === tipo.value
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="text-xs text-center">{tipo.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Produto" value={formData.produto} onChange={(e) => setFormData({ ...formData, produto: e.target.value })} required />
                        <Input label="Lote" value={formData.lote} onChange={(e) => setFormData({ ...formData, lote: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        <Input label="Quantidade" type="number" value={formData.quantidade} onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })} />
                        <Input label="Unidade" placeholder="un, pç..." value={formData.unidade} onChange={(e) => setFormData({ ...formData, unidade: e.target.value })} />
                        <Input label="Peso (kg)" type="number" value={formData.peso} onChange={(e) => setFormData({ ...formData, peso: e.target.value })} />
                        <Input label="Volume (L)" type="number" value={formData.volume} onChange={(e) => setFormData({ ...formData, volume: e.target.value })} />
                    </div>

                    <Textarea label="Motivo do Descarte" value={formData.motivo} onChange={(e) => setFormData({ ...formData, motivo: e.target.value })} rows={2} />

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Origem / Setor" value={formData.origem} onChange={(e) => setFormData({ ...formData, origem: e.target.value })} />
                        <Select label="Destino" options={DESTINO_OPTIONS} value={formData.destino} onChange={(e) => setFormData({ ...formData, destino: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Responsável" value={formData.responsavel} onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })} />
                        <Input label="Data do Descarte" type="date" value={formData.dataDescarte} onChange={(e) => setFormData({ ...formData, dataDescarte: e.target.value })} />
                        <Select label="Status" options={STATUS_OPTIONS} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Custo Estimado (R$)" type="number" value={formData.custoEstimado} onChange={(e) => setFormData({ ...formData, custoEstimado: e.target.value })} />
                        <Input label="Nº Certificado de Descarte" value={formData.certificadoDescarte} onChange={(e) => setFormData({ ...formData, certificadoDescarte: e.target.value })} />
                    </div>

                    <Textarea label="Impacto Ambiental" placeholder="Descreva o impacto ambiental se aplicável" value={formData.impactoAmbiental} onChange={(e) => setFormData({ ...formData, impactoAmbiental: e.target.value })} rows={2} />

                    <Textarea label="Observações" value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} rows={2} />
                </div>
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => { setIsViewModalOpen(false); setSelectedItem(null); }}
                title="Detalhes do Descarte"
                size="lg"
            >
                {selectedItem && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                            {(() => { const Icon = getTipoIcon(selectedItem.tipoDescarte); return <Icon size={24} className="text-gray-600" />; })()}
                            <div>
                                <p className="font-semibold text-gray-900">{selectedItem.produto}</p>
                                <p className="text-sm text-gray-500">{getTipoLabel(selectedItem.tipoDescarte)}</p>
                            </div>
                            <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedItem.status)}`}>
                                {STATUS_OPTIONS.find(s => s.value === selectedItem.status)?.label}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-sm text-gray-500">Lote</p><p className="font-mono">{selectedItem.lote || '-'}</p></div>
                            <div><p className="text-sm text-gray-500">Quantidade</p><p>{selectedItem.quantidade} {selectedItem.unidade}</p></div>
                            {selectedItem.peso && <div><p className="text-sm text-gray-500">Peso</p><p>{selectedItem.peso} kg</p></div>}
                            {selectedItem.volume && <div><p className="text-sm text-gray-500">Volume</p><p>{selectedItem.volume} L</p></div>}
                            <div><p className="text-sm text-gray-500">Origem</p><p>{selectedItem.origem || '-'}</p></div>
                            <div><p className="text-sm text-gray-500">Destino</p><p>{DESTINO_OPTIONS.find(d => d.value === selectedItem.destino)?.label || '-'}</p></div>
                            <div><p className="text-sm text-gray-500">Responsável</p><p>{selectedItem.responsavel || '-'}</p></div>
                            <div><p className="text-sm text-gray-500">Data</p><p>{selectedItem.dataDescarte ? new Date(selectedItem.dataDescarte).toLocaleDateString('pt-BR') : '-'}</p></div>
                            {selectedItem.custoEstimado && <div><p className="text-sm text-gray-500">Custo</p><p>R$ {selectedItem.custoEstimado}</p></div>}
                            {selectedItem.certificadoDescarte && <div><p className="text-sm text-gray-500">Certificado</p><p>{selectedItem.certificadoDescarte}</p></div>}
                        </div>

                        {selectedItem.motivo && (
                            <div className="p-3 bg-red-50 rounded-lg">
                                <p className="text-sm font-medium text-red-700">Motivo do Descarte</p>
                                <p className="text-red-900">{selectedItem.motivo}</p>
                            </div>
                        )}

                        {selectedItem.impactoAmbiental && (
                            <div className="p-3 bg-green-50 rounded-lg">
                                <p className="text-sm font-medium text-green-700">Impacto Ambiental</p>
                                <p className="text-green-900">{selectedItem.impactoAmbiental}</p>
                            </div>
                        )}

                        {selectedItem.observacoes && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium text-gray-700">Observações</p>
                                <p className="text-gray-900">{selectedItem.observacoes}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ControleDescartes;
