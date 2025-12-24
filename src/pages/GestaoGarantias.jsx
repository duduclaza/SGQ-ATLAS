import { useState, useEffect } from 'react';
import { Plus, Shield, Clock, CheckCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const STATUS_OPTIONS = [
    { value: 'ativa', label: 'Ativa' },
    { value: 'expirada', label: 'Expirada' },
    { value: 'em_analise', label: 'Em Análise' },
    { value: 'resolvida', label: 'Resolvida' }
];

const GestaoGarantias = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        produto: '', cliente: '', numeroSerie: '', dataCompra: '', dataExpiracao: '', status: 'ativa', observacoes: ''
    });

    useEffect(() => { loadItems(); }, []);
    const loadItems = () => setItems(storage.getAll(STORAGE_KEYS.GARANTIAS));

    const handleSubmit = () => {
        if (selectedItem) storage.update(STORAGE_KEYS.GARANTIAS, selectedItem.id, formData);
        else storage.add(STORAGE_KEYS.GARANTIAS, formData);
        loadItems(); setIsModalOpen(false); setSelectedItem(null);
        setFormData({ produto: '', cliente: '', numeroSerie: '', dataCompra: '', dataExpiracao: '', status: 'ativa', observacoes: '' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ativa': return 'badge-success';
            case 'expirada': return 'badge-danger';
            case 'em_analise': return 'badge-warning';
            case 'resolvida': return 'badge-primary';
            default: return 'badge-gray';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-gray-900">Gestão de Garantias</h1><p className="text-gray-500 mt-1">Controle de garantias de produtos</p></div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Nova Garantia</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg"><Shield className="text-gray-600" size={20} /></div>
                        <div><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{items.length}</p></div>
                    </div>
                </Card>
                <Card className="bg-green-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="text-green-600" size={20} /></div>
                        <div><p className="text-sm text-green-600">Ativas</p><p className="text-2xl font-bold text-green-700">{items.filter(i => i.status === 'ativa').length}</p></div>
                    </div>
                </Card>
                <Card className="bg-yellow-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg"><Clock className="text-yellow-600" size={20} /></div>
                        <div><p className="text-sm text-yellow-600">Em Análise</p><p className="text-2xl font-bold text-yellow-700">{items.filter(i => i.status === 'em_analise').length}</p></div>
                    </div>
                </Card>
                <Card className="bg-red-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg"><AlertCircle className="text-red-600" size={20} /></div>
                        <div><p className="text-sm text-red-600">Expiradas</p><p className="text-2xl font-bold text-red-700">{items.filter(i => i.status === 'expirada').length}</p></div>
                    </div>
                </Card>
            </div>

            <Card padding="p-0">
                <table className="w-full">
                    <thead><tr className="bg-gray-50">
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Produto</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Cliente</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Nº Série</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Validade</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                        <th className="text-right py-4 px-6 font-semibold text-gray-700">Ações</th>
                    </tr></thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr><td colSpan={6} className="py-12 text-center text-gray-500">
                                <Shield className="mx-auto mb-3 text-gray-300" size={48} /><p>Nenhuma garantia cadastrada</p>
                            </td></tr>
                        ) : items.map((item) => (
                            <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="py-4 px-6 font-medium">{item.produto}</td>
                                <td className="py-4 px-6">{item.cliente}</td>
                                <td className="py-4 px-6 font-mono text-sm">{item.numeroSerie || '-'}</td>
                                <td className="py-4 px-6 text-sm">{item.dataExpiracao ? new Date(item.dataExpiracao).toLocaleDateString('pt-BR') : '-'}</td>
                                <td className="py-4 px-6"><span className={`badge ${getStatusColor(item.status)}`}>{item.status}</span></td>
                                <td className="py-4 px-6">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setSelectedItem(item); setFormData(item); setIsModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><Edit size={18} className="text-gray-500" /></button>
                                        <button onClick={() => { if (confirm('Excluir?')) { storage.delete(STORAGE_KEYS.GARANTIAS, item.id); loadItems(); } }} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} className="text-red-500" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedItem(null); }} title={selectedItem ? 'Editar Garantia' : 'Nova Garantia'} size="lg"
                footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button onClick={handleSubmit}>Salvar</Button></>}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Produto" value={formData.produto} onChange={(e) => setFormData({ ...formData, produto: e.target.value })} required />
                        <Input label="Cliente" value={formData.cliente} onChange={(e) => setFormData({ ...formData, cliente: e.target.value })} required />
                    </div>
                    <Input label="Número de Série" value={formData.numeroSerie} onChange={(e) => setFormData({ ...formData, numeroSerie: e.target.value })} />
                    <div className="grid grid-cols-3 gap-4">
                        <Input label="Data da Compra" type="date" value={formData.dataCompra} onChange={(e) => setFormData({ ...formData, dataCompra: e.target.value })} />
                        <Input label="Data de Expiração" type="date" value={formData.dataExpiracao} onChange={(e) => setFormData({ ...formData, dataExpiracao: e.target.value })} />
                        <Select label="Status" options={STATUS_OPTIONS} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                    </div>
                    <Textarea label="Observações" value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} rows={2} />
                </div>
            </Modal>
        </div>
    );
};

export default GestaoGarantias;
