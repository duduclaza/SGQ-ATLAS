// Análise de Pareto
import { useState, useEffect } from 'react';
import { Plus, PieChart, Edit, Trash2 } from 'lucide-react';
import { Button, Card, Input, Modal, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const Pareto = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({ titulo: '', descricao: '', causas: '', conclusao: '' });

    useEffect(() => { loadItems(); }, []);
    const loadItems = () => setItems(storage.getAll(STORAGE_KEYS.PARETO));

    const handleSubmit = () => {
        if (selectedItem) storage.update(STORAGE_KEYS.PARETO, selectedItem.id, formData);
        else storage.add(STORAGE_KEYS.PARETO, formData);
        loadItems(); setIsModalOpen(false); setSelectedItem(null);
        setFormData({ titulo: '', descricao: '', causas: '', conclusao: '' });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-gray-900">Análises de Pareto</h1><p className="text-gray-500 mt-1">Princípio 80/20 para priorização de problemas</p></div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Nova Análise</Button>
            </div>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl"><PieChart size={32} /></div>
                    <div>
                        <p className="text-orange-100">Total de Análises</p>
                        <p className="text-3xl font-bold">{items.length}</p>
                    </div>
                </div>
            </Card>

            {items.length === 0 ? (
                <Card className="py-12 text-center">
                    <PieChart className="mx-auto mb-3 text-gray-300" size={48} /><p className="text-gray-500">Nenhuma análise de Pareto</p>
                    <Button variant="ghost" className="mt-3" onClick={() => setIsModalOpen(true)}>Criar primeira análise</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item) => (
                        <Card key={item.id} hover>
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg"><PieChart className="text-orange-600" size={20} /></div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setSelectedItem(item); setFormData(item); setIsModalOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={16} className="text-gray-500" /></button>
                                    <button onClick={() => { if (confirm('Excluir?')) { storage.delete(STORAGE_KEYS.PARETO, item.id); loadItems(); } }} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900">{item.titulo}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.descricao}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</p>
                        </Card>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedItem(null); }} title={selectedItem ? 'Editar Análise' : 'Nova Análise de Pareto'} size="lg"
                footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button onClick={handleSubmit}>Salvar</Button></>}>
                <div className="space-y-4">
                    <Input label="Título" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} required />
                    <Textarea label="Descrição" placeholder="Contexto da análise" value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} rows={2} />
                    <Textarea label="Causas Identificadas" placeholder="Liste as causas ordenadas por frequência/impacto" value={formData.causas} onChange={(e) => setFormData({ ...formData, causas: e.target.value })} rows={4} />
                    <Textarea label="Conclusão" placeholder="Principais causas que representam 80% do problema" value={formData.conclusao} onChange={(e) => setFormData({ ...formData, conclusao: e.target.value })} rows={2} />
                </div>
            </Modal>
        </div>
    );
};

export default Pareto;
