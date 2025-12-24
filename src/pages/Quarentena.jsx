// Controle de Quarentena
import { useState, useEffect } from 'react';
import { Plus, Archive, CheckCircle, AlertCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const STATUS_OPTIONS = [
    { value: 'quarentena', label: 'Em Quarentena' },
    { value: 'aguardando_analise', label: 'Aguardando Análise' },
    { value: 'liberado', label: 'Liberado' },
    { value: 'descartado', label: 'Descartado' },
    { value: 'retrabalhado', label: 'Retrabalhado' }
];

const Quarentena = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        produto: '', lote: '', quantidade: '', unidade: '', motivo: '', status: 'quarentena', responsavel: '', dataEntrada: '', dataSaida: '', decisao: '', observacoes: ''
    });

    useEffect(() => { loadItems(); }, []);
    const loadItems = () => setItems(storage.getAll(STORAGE_KEYS.QUARENTENA));

    const handleSubmit = () => {
        if (selectedItem) storage.update(STORAGE_KEYS.QUARENTENA, selectedItem.id, formData);
        else storage.add(STORAGE_KEYS.QUARENTENA, formData);
        loadItems(); setIsModalOpen(false); setSelectedItem(null);
        setFormData({ produto: '', lote: '', quantidade: '', unidade: '', motivo: '', status: 'quarentena', responsavel: '', dataEntrada: '', dataSaida: '', decisao: '', observacoes: '' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'quarentena': return 'bg-red-100 text-red-700';
            case 'aguardando_analise': return 'bg-yellow-100 text-yellow-700';
            case 'liberado': return 'bg-green-100 text-green-700';
            case 'descartado': return 'bg-gray-100 text-gray-700';
            case 'retrabalhado': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-gray-900">Controle de Quarentena</h1><p className="text-gray-500 mt-1">Gestão de itens em quarentena</p></div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Novo Item</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-red-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg"><Archive className="text-red-600" size={20} /></div>
                        <div><p className="text-sm text-red-600">Em Quarentena</p><p className="text-2xl font-bold text-red-700">{items.filter(i => i.status === 'quarentena').length}</p></div>
                    </div>
                </Card>
                <Card className="bg-yellow-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg"><Clock className="text-yellow-600" size={20} /></div>
                        <div><p className="text-sm text-yellow-600">Aguardando</p><p className="text-2xl font-bold text-yellow-700">{items.filter(i => i.status === 'aguardando_analise').length}</p></div>
                    </div>
                </Card>
                <Card className="bg-green-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="text-green-600" size={20} /></div>
                        <div><p className="text-sm text-green-600">Liberados</p><p className="text-2xl font-bold text-green-700">{items.filter(i => i.status === 'liberado').length}</p></div>
                    </div>
                </Card>
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg"><AlertCircle className="text-gray-600" size={20} /></div>
                        <div><p className="text-sm text-gray-500">Descartados</p><p className="text-2xl font-bold">{items.filter(i => i.status === 'descartado').length}</p></div>
                    </div>
                </Card>
            </div>

            <Card padding="p-0">
                <table className="w-full">
                    <thead><tr className="bg-gray-50">
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Produto</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Lote</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Qtd</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Motivo</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Data Entrada</th>
                        <th className="text-right py-4 px-6 font-semibold text-gray-700">Ações</th>
                    </tr></thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr><td colSpan={7} className="py-12 text-center text-gray-500">
                                <Archive className="mx-auto mb-3 text-gray-300" size={48} /><p>Nenhum item em quarentena</p>
                            </td></tr>
                        ) : items.map((item) => (
                            <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="py-4 px-6 font-medium">{item.produto}</td>
                                <td className="py-4 px-6 font-mono text-sm">{item.lote || '-'}</td>
                                <td className="py-4 px-6 text-sm">{item.quantidade} {item.unidade}</td>
                                <td className="py-4 px-6 text-sm truncate max-w-xs">{item.motivo}</td>
                                <td className="py-4 px-6"><span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>{STATUS_OPTIONS.find(s => s.value === item.status)?.label}</span></td>
                                <td className="py-4 px-6 text-sm">{item.dataEntrada ? new Date(item.dataEntrada).toLocaleDateString('pt-BR') : '-'}</td>
                                <td className="py-4 px-6">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setSelectedItem(item); setFormData(item); setIsModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><Edit size={18} className="text-gray-500" /></button>
                                        <button onClick={() => { if (confirm('Excluir?')) { storage.delete(STORAGE_KEYS.QUARENTENA, item.id); loadItems(); } }} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} className="text-red-500" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedItem(null); }} title={selectedItem ? 'Editar Item' : 'Novo Item em Quarentena'} size="lg"
                footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button onClick={handleSubmit}>Salvar</Button></>}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Produto" value={formData.produto} onChange={(e) => setFormData({ ...formData, produto: e.target.value })} required />
                        <Input label="Lote" value={formData.lote} onChange={(e) => setFormData({ ...formData, lote: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Quantidade" type="number" value={formData.quantidade} onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })} />
                        <Input label="Unidade" placeholder="un, kg, L..." value={formData.unidade} onChange={(e) => setFormData({ ...formData, unidade: e.target.value })} />
                        <Select label="Status" options={STATUS_OPTIONS} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                    </div>
                    <Textarea label="Motivo da Quarentena" value={formData.motivo} onChange={(e) => setFormData({ ...formData, motivo: e.target.value })} rows={2} />
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Responsável" value={formData.responsavel} onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })} />
                        <Input label="Data de Entrada" type="date" value={formData.dataEntrada} onChange={(e) => setFormData({ ...formData, dataEntrada: e.target.value })} />
                        <Input label="Data de Saída" type="date" value={formData.dataSaida} onChange={(e) => setFormData({ ...formData, dataSaida: e.target.value })} />
                    </div>
                    <Textarea label="Decisão/Disposição" placeholder="Ação tomada sobre o item" value={formData.decisao} onChange={(e) => setFormData({ ...formData, decisao: e.target.value })} rows={2} />
                    <Textarea label="Observações" value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} rows={2} />
                </div>
            </Modal>
        </div>
    );
};

export default Quarentena;
