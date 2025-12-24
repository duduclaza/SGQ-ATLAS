// Análise de Ishikawa (Diagrama de Causa e Efeito)
import { useState, useEffect } from 'react';
import { Plus, GitBranch, Edit, Trash2, Eye } from 'lucide-react';
import { Button, Card, Input, Modal, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const CATEGORIAS_ISHIKAWA = ['Método', 'Máquina', 'Mão de Obra', 'Material', 'Meio Ambiente', 'Medição'];

const Ishikawa = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '', problema: '', metodo: '', maquina: '', maoDeObra: '', material: '', meioAmbiente: '', medicao: '', conclusao: ''
    });

    useEffect(() => { loadItems(); }, []);
    const loadItems = () => setItems(storage.getAll(STORAGE_KEYS.ISHIKAWA));

    const handleSubmit = () => {
        if (selectedItem) storage.update(STORAGE_KEYS.ISHIKAWA, selectedItem.id, formData);
        else storage.add(STORAGE_KEYS.ISHIKAWA, formData);
        loadItems(); setIsModalOpen(false); setSelectedItem(null);
        setFormData({ titulo: '', problema: '', metodo: '', maquina: '', maoDeObra: '', material: '', meioAmbiente: '', medicao: '', conclusao: '' });
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-gray-900">Análises de Ishikawa</h1><p className="text-gray-500 mt-1">Diagrama de Causa e Efeito (Espinha de Peixe)</p></div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Nova Análise</Button>
            </div>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-xl"><GitBranch size={32} /></div>
                    <div>
                        <p className="text-purple-100">Total de Análises</p>
                        <p className="text-3xl font-bold">{items.length}</p>
                    </div>
                </div>
            </Card>

            {items.length === 0 ? (
                <Card className="py-12 text-center">
                    <GitBranch className="mx-auto mb-3 text-gray-300" size={48} /><p className="text-gray-500">Nenhuma análise de Ishikawa</p>
                    <Button variant="ghost" className="mt-3" onClick={() => setIsModalOpen(true)}>Criar primeira análise</Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item) => (
                        <Card key={item.id} hover>
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg"><GitBranch className="text-purple-600" size={20} /></div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setSelectedItem(item); setIsViewModalOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={16} className="text-gray-500" /></button>
                                    <button onClick={() => { setSelectedItem(item); setFormData(item); setIsModalOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={16} className="text-gray-500" /></button>
                                    <button onClick={() => { if (confirm('Excluir?')) { storage.delete(STORAGE_KEYS.ISHIKAWA, item.id); loadItems(); } }} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-gray-900">{item.titulo}</h3>
                            <p className="text-sm text-gray-500 mt-1">Problema: {item.problema}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</p>
                        </Card>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedItem(null); }} title={selectedItem ? 'Editar Análise' : 'Nova Análise de Ishikawa'} size="xl"
                footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button onClick={handleSubmit}>Salvar</Button></>}>
                <div className="space-y-4">
                    <Input label="Título" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} required />
                    <Textarea label="Problema (Efeito)" placeholder="Descreva o problema" value={formData.problema} onChange={(e) => setFormData({ ...formData, problema: e.target.value })} rows={2} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Textarea label="Método" placeholder="Causas relacionadas ao método" value={formData.metodo} onChange={(e) => setFormData({ ...formData, metodo: e.target.value })} rows={2} />
                        <Textarea label="Máquina" placeholder="Causas relacionadas a máquinas/equipamentos" value={formData.maquina} onChange={(e) => setFormData({ ...formData, maquina: e.target.value })} rows={2} />
                        <Textarea label="Mão de Obra" placeholder="Causas relacionadas a pessoas" value={formData.maoDeObra} onChange={(e) => setFormData({ ...formData, maoDeObra: e.target.value })} rows={2} />
                        <Textarea label="Material" placeholder="Causas relacionadas a materiais" value={formData.material} onChange={(e) => setFormData({ ...formData, material: e.target.value })} rows={2} />
                        <Textarea label="Meio Ambiente" placeholder="Causas relacionadas ao ambiente" value={formData.meioAmbiente} onChange={(e) => setFormData({ ...formData, meioAmbiente: e.target.value })} rows={2} />
                        <Textarea label="Medição" placeholder="Causas relacionadas a medições" value={formData.medicao} onChange={(e) => setFormData({ ...formData, medicao: e.target.value })} rows={2} />
                    </div>
                    <Textarea label="Conclusão / Causa Raiz" value={formData.conclusao} onChange={(e) => setFormData({ ...formData, conclusao: e.target.value })} rows={2} />
                </div>
            </Modal>

            <Modal isOpen={isViewModalOpen} onClose={() => { setIsViewModalOpen(false); setSelectedItem(null); }} title="Análise de Ishikawa" size="xl">
                {selectedItem && (
                    <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm font-medium text-purple-700">Problema</p>
                            <p className="text-purple-900">{selectedItem.problema}</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {CATEGORIAS_ISHIKAWA.map((cat) => {
                                const key = cat.toLowerCase().replace(/ /g, '').replace('ã', 'a').replace('í', 'i');
                                const fieldMap = { metodo: 'metodo', maquina: 'maquina', maodeobra: 'maoDeObra', material: 'material', meioambiente: 'meioAmbiente', medicao: 'medicao' };
                                const value = selectedItem[fieldMap[key]];
                                return (
                                    <div key={cat} className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium text-gray-700">{cat}</p>
                                        <p className="text-sm text-gray-600 mt-1">{value || '-'}</p>
                                    </div>
                                );
                            })}
                        </div>
                        {selectedItem.conclusao && (
                            <div className="p-4 bg-green-50 rounded-lg">
                                <p className="text-sm font-medium text-green-700">Conclusão / Causa Raiz</p>
                                <p className="text-green-900">{selectedItem.conclusao}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Ishikawa;
