// Módulo de Gestão de ITs - Similar ao POPs mas para Instruções de Trabalho
import { useState, useEffect } from 'react';
import { Plus, Search, FileCode, CheckCircle, Clock, FileText, Edit, Trash2, Eye } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const STATUS_OPTIONS = [
    { value: 'rascunho', label: 'Rascunho' },
    { value: 'em_revisao', label: 'Em Revisão' },
    { value: 'aprovado', label: 'Aprovado' },
    { value: 'obsoleto', label: 'Obsoleto' }
];

const getStatusColor = (status) => {
    switch (status) {
        case 'rascunho': return 'badge-gray';
        case 'em_revisao': return 'badge-warning';
        case 'aprovado': return 'badge-success';
        case 'obsoleto': return 'badge-danger';
        default: return 'badge-gray';
    }
};

const GestaoITs = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        codigo: '',
        titulo: '',
        objetivo: '',
        instrucoes: '',
        popRelacionado: '',
        versao: '1.0',
        status: 'rascunho',
        elaborador: ''
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = () => {
        const data = storage.getAll(STORAGE_KEYS.ITS);
        setItems(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedItem) {
            storage.update(STORAGE_KEYS.ITS, selectedItem.id, formData);
        } else {
            storage.add(STORAGE_KEYS.ITS, formData);
        }
        loadItems();
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (confirm('Deseja realmente excluir esta IT?')) {
            storage.delete(STORAGE_KEYS.ITS, id);
            loadItems();
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setFormData({ ...item });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        setFormData({
            codigo: '', titulo: '', objetivo: '', instrucoes: '', popRelacionado: '', versao: '1.0', status: 'rascunho', elaborador: ''
        });
    };

    const filteredItems = items.filter(item =>
        item.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de ITs</h1>
                    <p className="text-gray-500 mt-1">Instruções de Trabalho</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Nova IT</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg"><FileCode className="text-gray-600" size={20} /></div>
                        <div><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{items.length}</p></div>
                    </div>
                </Card>
                <Card className="bg-green-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="text-green-600" size={20} /></div>
                        <div><p className="text-sm text-green-600">Aprovadas</p><p className="text-2xl font-bold text-green-700">{items.filter(i => i.status === 'aprovado').length}</p></div>
                    </div>
                </Card>
                <Card className="bg-yellow-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg"><Clock className="text-yellow-600" size={20} /></div>
                        <div><p className="text-sm text-yellow-600">Em Revisão</p><p className="text-2xl font-bold text-yellow-700">{items.filter(i => i.status === 'em_revisao').length}</p></div>
                    </div>
                </Card>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Buscar ITs..." className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <Card padding="p-0">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Código</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Título</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Versão</th>
                            <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                            <th className="text-right py-4 px-6 font-semibold text-gray-700">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.length === 0 ? (
                            <tr><td colSpan={5} className="py-12 text-center text-gray-500">
                                <FileCode className="mx-auto mb-3 text-gray-300" size={48} /><p>Nenhuma IT encontrada</p>
                            </td></tr>
                        ) : filteredItems.map((item) => (
                            <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="py-4 px-6"><span className="font-mono text-blue-600">{item.codigo}</span></td>
                                <td className="py-4 px-6"><p className="font-medium">{item.titulo}</p></td>
                                <td className="py-4 px-6">v{item.versao}</td>
                                <td className="py-4 px-6"><span className={`badge ${getStatusColor(item.status)}`}>{item.status}</span></td>
                                <td className="py-4 px-6">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(item)} className="p-2 hover:bg-gray-100 rounded-lg"><Edit size={18} className="text-gray-500" /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} className="text-red-500" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedItem ? 'Editar IT' : 'Nova IT'} size="lg"
                footer={<><Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button><Button onClick={handleSubmit}>{selectedItem ? 'Salvar' : 'Criar'}</Button></>}>
                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Código" placeholder="IT-001" value={formData.codigo} onChange={(e) => setFormData({ ...formData, codigo: e.target.value })} required />
                        <Input label="Versão" value={formData.versao} onChange={(e) => setFormData({ ...formData, versao: e.target.value })} />
                    </div>
                    <Input label="Título" placeholder="Título da IT" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} required />
                    <Textarea label="Objetivo" placeholder="Objetivo" value={formData.objetivo} onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })} rows={2} />
                    <Textarea label="Instruções" placeholder="Instruções detalhadas" value={formData.instrucoes} onChange={(e) => setFormData({ ...formData, instrucoes: e.target.value })} rows={4} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="POP Relacionado" placeholder="POP-001" value={formData.popRelacionado} onChange={(e) => setFormData({ ...formData, popRelacionado: e.target.value })} />
                        <Select label="Status" options={STATUS_OPTIONS} value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                    </div>
                    <Input label="Elaborador" value={formData.elaborador} onChange={(e) => setFormData({ ...formData, elaborador: e.target.value })} />
                </form>
            </Modal>
        </div>
    );
};

export default GestaoITs;
