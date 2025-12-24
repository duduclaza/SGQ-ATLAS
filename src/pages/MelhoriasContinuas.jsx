// Melhoria Contínua - PDCA/Kaizen
import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Edit, Trash2, CheckCircle, Clock, PlayCircle } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const STATUS_OPTIONS = [
    { value: 'planejamento', label: 'Planejamento (Plan)' },
    { value: 'execucao', label: 'Execução (Do)' },
    { value: 'verificacao', label: 'Verificação (Check)' },
    { value: 'acao', label: 'Ação (Act)' },
    { value: 'concluido', label: 'Concluído' }
];

const MelhoriasContinuas = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '', descricao: '', objetivo: '', responsavel: '', status: 'planejamento', plan: '', doAction: '', check: '', act: '', resultado: ''
    });

    useEffect(() => { loadItems(); }, []);
    const loadItems = () => setItems(storage.getAll(STORAGE_KEYS.MELHORIAS));

    const handleSubmit = () => {
        if (selectedItem) storage.update(STORAGE_KEYS.MELHORIAS, selectedItem.id, formData);
        else storage.add(STORAGE_KEYS.MELHORIAS, formData);
        loadItems(); setIsModalOpen(false); setSelectedItem(null);
        setFormData({ titulo: '', descricao: '', objetivo: '', responsavel: '', status: 'planejamento', plan: '', doAction: '', check: '', act: '', resultado: '' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'planejamento': return 'bg-blue-100 text-blue-700';
            case 'execucao': return 'bg-yellow-100 text-yellow-700';
            case 'verificacao': return 'bg-purple-100 text-purple-700';
            case 'acao': return 'bg-orange-100 text-orange-700';
            case 'concluido': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-gray-900">Melhoria Contínua</h1><p className="text-gray-500 mt-1">Projetos PDCA e Kaizen</p></div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Novo Projeto</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-blue-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg"><PlayCircle className="text-blue-600" size={20} /></div>
                        <div><p className="text-sm text-blue-600">Em Andamento</p><p className="text-2xl font-bold text-blue-700">{items.filter(i => i.status !== 'concluido').length}</p></div>
                    </div>
                </Card>
                <Card className="bg-green-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="text-green-600" size={20} /></div>
                        <div><p className="text-sm text-green-600">Concluídos</p><p className="text-2xl font-bold text-green-700">{items.filter(i => i.status === 'concluido').length}</p></div>
                    </div>
                </Card>
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg"><TrendingUp className="text-gray-600" size={20} /></div>
                        <div><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{items.length}</p></div>
                    </div>
                </Card>
            </div>

            {items.length === 0 ? (
                <Card className="py-12 text-center">
                    <TrendingUp className="mx-auto mb-3 text-gray-300" size={48} /><p className="text-gray-500">Nenhum projeto de melhoria</p>
                    <Button variant="ghost" className="mt-3" onClick={() => setIsModalOpen(true)}>Criar primeiro projeto</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <Card key={item.id} hover>
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                                    {STATUS_OPTIONS.find(s => s.value === item.status)?.label}
                                </span>
                                <div className="flex gap-1">
                                    <button onClick={() => { setSelectedItem(item); setFormData(item); setIsModalOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={16} className="text-gray-500" /></button>
                                    <button onClick={() => { if (confirm('Excluir?')) { storage.delete(STORAGE_KEYS.MELHORIAS, item.id); loadItems(); } }} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900">{item.titulo}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.objetivo}</p>
                            <p className="text-xs text-gray-400 mt-2">Responsável: {item.responsavel || '-'}</p>
                        </Card>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedItem(null); }} title={selectedItem ? 'Editar Projeto' : 'Novo Projeto de Melhoria'} size="xl"
                footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button onClick={handleSubmit}>Salvar</Button></>}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Título" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} required />
                        <Select label="Status PDCA" options={STATUS_OPTIONS} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                    </div>
                    <Textarea label="Objetivo" value={formData.objetivo} onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })} rows={2} />
                    <Input label="Responsável" value={formData.responsavel} onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <Textarea label="Plan (Planejar)" placeholder="O que será feito?" value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value })} rows={2} />
                        <Textarea label="Do (Fazer)" placeholder="Como foi executado?" value={formData.doAction} onChange={(e) => setFormData({ ...formData, doAction: e.target.value })} rows={2} />
                        <Textarea label="Check (Verificar)" placeholder="Resultados obtidos?" value={formData.check} onChange={(e) => setFormData({ ...formData, check: e.target.value })} rows={2} />
                        <Textarea label="Act (Agir)" placeholder="Ações de correção/padronização" value={formData.act} onChange={(e) => setFormData({ ...formData, act: e.target.value })} rows={2} />
                    </div>
                    <Textarea label="Resultado Final" value={formData.resultado} onChange={(e) => setFormData({ ...formData, resultado: e.target.value })} rows={2} />
                </div>
            </Modal>
        </div>
    );
};

export default MelhoriasContinuas;
