// Controle de Auditorias
import { useState, useEffect } from 'react';
import { Plus, Search, Calendar, CheckCircle, Clock, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const STATUS_OPTIONS = [
    { value: 'planejada', label: 'Planejada' },
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'concluida', label: 'Concluída' },
    { value: 'cancelada', label: 'Cancelada' }
];

const TIPO_OPTIONS = [
    { value: 'interna', label: 'Auditoria Interna' },
    { value: 'externa', label: 'Auditoria Externa' },
    { value: 'certificacao', label: 'Auditoria de Certificação' },
    { value: 'fornecedor', label: 'Auditoria de Fornecedor' }
];

const Auditorias = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '', tipo: '', dataAgendada: '', auditor: '', escopo: '', status: 'planejada', constatacoes: '', naoConformidades: '', observacoes: ''
    });

    useEffect(() => { loadItems(); }, []);
    const loadItems = () => setItems(storage.getAll(STORAGE_KEYS.AUDITORIAS));

    const handleSubmit = () => {
        if (selectedItem) storage.update(STORAGE_KEYS.AUDITORIAS, selectedItem.id, formData);
        else storage.add(STORAGE_KEYS.AUDITORIAS, formData);
        loadItems(); setIsModalOpen(false); setSelectedItem(null);
        setFormData({ titulo: '', tipo: '', dataAgendada: '', auditor: '', escopo: '', status: 'planejada', constatacoes: '', naoConformidades: '', observacoes: '' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'planejada': return 'badge-primary';
            case 'em_andamento': return 'badge-warning';
            case 'concluida': return 'badge-success';
            case 'cancelada': return 'badge-danger';
            default: return 'badge-gray';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-gray-900">Controle de Auditorias</h1><p className="text-gray-500 mt-1">Planejamento e acompanhamento de auditorias</p></div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Nova Auditoria</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-blue-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg"><Calendar className="text-blue-600" size={20} /></div>
                        <div><p className="text-sm text-blue-600">Planejadas</p><p className="text-2xl font-bold text-blue-700">{items.filter(i => i.status === 'planejada').length}</p></div>
                    </div>
                </Card>
                <Card className="bg-yellow-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg"><Clock className="text-yellow-600" size={20} /></div>
                        <div><p className="text-sm text-yellow-600">Em Andamento</p><p className="text-2xl font-bold text-yellow-700">{items.filter(i => i.status === 'em_andamento').length}</p></div>
                    </div>
                </Card>
                <Card className="bg-green-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="text-green-600" size={20} /></div>
                        <div><p className="text-sm text-green-600">Concluídas</p><p className="text-2xl font-bold text-green-700">{items.filter(i => i.status === 'concluida').length}</p></div>
                    </div>
                </Card>
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg"><Search className="text-gray-600" size={20} /></div>
                        <div><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{items.length}</p></div>
                    </div>
                </Card>
            </div>

            <Card padding="p-0">
                <table className="w-full">
                    <thead><tr className="bg-gray-50">
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Auditoria</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Tipo</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Data</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Auditor</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                        <th className="text-right py-4 px-6 font-semibold text-gray-700">Ações</th>
                    </tr></thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr><td colSpan={6} className="py-12 text-center text-gray-500">
                                <Search className="mx-auto mb-3 text-gray-300" size={48} /><p>Nenhuma auditoria cadastrada</p>
                            </td></tr>
                        ) : items.map((item) => (
                            <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="py-4 px-6 font-medium">{item.titulo}</td>
                                <td className="py-4 px-6 text-sm capitalize">{TIPO_OPTIONS.find(t => t.value === item.tipo)?.label || '-'}</td>
                                <td className="py-4 px-6 text-sm">{item.dataAgendada ? new Date(item.dataAgendada).toLocaleDateString('pt-BR') : '-'}</td>
                                <td className="py-4 px-6 text-sm">{item.auditor || '-'}</td>
                                <td className="py-4 px-6"><span className={`badge ${getStatusColor(item.status)}`}>{STATUS_OPTIONS.find(s => s.value === item.status)?.label}</span></td>
                                <td className="py-4 px-6">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setSelectedItem(item); setFormData(item); setIsModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><Edit size={18} className="text-gray-500" /></button>
                                        <button onClick={() => { if (confirm('Excluir?')) { storage.delete(STORAGE_KEYS.AUDITORIAS, item.id); loadItems(); } }} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} className="text-red-500" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedItem(null); }} title={selectedItem ? 'Editar Auditoria' : 'Nova Auditoria'} size="xl"
                footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button onClick={handleSubmit}>Salvar</Button></>}>
                <div className="space-y-4">
                    <Input label="Título" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} required />
                    <div className="grid grid-cols-3 gap-4">
                        <Select label="Tipo" options={TIPO_OPTIONS} value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} />
                        <Input label="Data Agendada" type="date" value={formData.dataAgendada} onChange={(e) => setFormData({ ...formData, dataAgendada: e.target.value })} />
                        <Select label="Status" options={STATUS_OPTIONS} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                    </div>
                    <Input label="Auditor" value={formData.auditor} onChange={(e) => setFormData({ ...formData, auditor: e.target.value })} />
                    <Textarea label="Escopo" value={formData.escopo} onChange={(e) => setFormData({ ...formData, escopo: e.target.value })} rows={2} />
                    <Textarea label="Constatações" value={formData.constatacoes} onChange={(e) => setFormData({ ...formData, constatacoes: e.target.value })} rows={2} />
                    <Textarea label="Não Conformidades Encontradas" value={formData.naoConformidades} onChange={(e) => setFormData({ ...formData, naoConformidades: e.target.value })} rows={2} />
                    <Textarea label="Observações" value={formData.observacoes} onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })} rows={2} />
                </div>
            </Modal>
        </div>
    );
};

export default Auditorias;
