import { useState, useEffect } from 'react';
import { Plus, Workflow, Edit, Trash2 } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const GestaoProcessos = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ nome: '', descricao: '', tipo: '', responsavel: '', status: 'ativo' });

    useEffect(() => { loadItems(); }, []);
    const loadItems = () => setItems(storage.getAll(STORAGE_KEYS.PROCESSOS));

    const handleSubmit = () => {
        if (selectedItem) storage.update(STORAGE_KEYS.PROCESSOS, selectedItem.id, formData);
        else storage.add(STORAGE_KEYS.PROCESSOS, formData);
        loadItems();
        setIsModalOpen(false);
        setSelectedItem(null);
        setFormData({ nome: '', descricao: '', tipo: '', responsavel: '', status: 'ativo' });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de Processos (BPMN)</h1>
                    <p className="text-gray-500 mt-1">Mapeamento e gestão de processos</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Novo Processo</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg"><Workflow className="text-blue-600" size={20} /></div>
                        <div><p className="text-sm text-blue-600">Total de Processos</p><p className="text-2xl font-bold text-blue-700">{items.length}</p></div>
                    </div>
                </Card>
            </div>

            {items.length === 0 ? (
                <Card className="py-12 text-center">
                    <Workflow className="mx-auto mb-3 text-gray-300" size={48} />
                    <p className="text-gray-500">Nenhum processo cadastrado</p>
                    <Button variant="ghost" className="mt-3" onClick={() => setIsModalOpen(true)}>Criar primeiro processo</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <Card key={item.id} hover>
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg"><Workflow className="text-blue-600" size={20} /></div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setSelectedItem(item); setFormData(item); setIsModalOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={16} className="text-gray-500" /></button>
                                    <button onClick={() => { if (confirm('Excluir?')) { storage.delete(STORAGE_KEYS.PROCESSOS, item.id); loadItems(); } }} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900">{item.nome}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.descricao}</p>
                            <p className="text-xs text-gray-400 mt-2">Responsável: {item.responsavel || '-'}</p>
                        </Card>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedItem(null); }} title={selectedItem ? 'Editar Processo' : 'Novo Processo'} size="md"
                footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button onClick={handleSubmit}>Salvar</Button></>}>
                <div className="space-y-4">
                    <Input label="Nome do Processo" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
                    <Textarea label="Descrição" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} rows={3} />
                    <Input label="Responsável" value={formData.responsavel} onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })} />
                </div>
            </Modal>
        </div>
    );
};

export default GestaoProcessos;
