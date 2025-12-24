// FMEA - Failure Mode and Effects Analysis
import { useState, useEffect } from 'react';
import { Plus, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const FMEA = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        processo: '', modoFalha: '', efeitos: '', causas: '', severidade: '1', ocorrencia: '1', deteccao: '1', acaoRecomendada: '', responsavel: '', status: 'pendente'
    });

    useEffect(() => { loadItems(); }, []);
    const loadItems = () => setItems(storage.getAll(STORAGE_KEYS.FMEA));

    const calculateRPN = (s, o, d) => (parseInt(s) || 1) * (parseInt(o) || 1) * (parseInt(d) || 1);

    const handleSubmit = () => {
        const dataWithRPN = { ...formData, rpn: calculateRPN(formData.severidade, formData.ocorrencia, formData.deteccao) };
        if (selectedItem) storage.update(STORAGE_KEYS.FMEA, selectedItem.id, dataWithRPN);
        else storage.add(STORAGE_KEYS.FMEA, dataWithRPN);
        loadItems(); setIsModalOpen(false); setSelectedItem(null);
        setFormData({ processo: '', modoFalha: '', efeitos: '', causas: '', severidade: '1', ocorrencia: '1', deteccao: '1', acaoRecomendada: '', responsavel: '', status: 'pendente' });
    };

    const getRPNColor = (rpn) => {
        if (rpn >= 200) return 'bg-red-100 text-red-700';
        if (rpn >= 100) return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    const scoreOptions = Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-gray-900">FMEA</h1><p className="text-gray-500 mt-1">Failure Mode and Effects Analysis</p></div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Nova Análise</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-red-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="text-red-600" size={20} /></div>
                        <div><p className="text-sm text-red-600">Alto Risco (RPN≥200)</p><p className="text-2xl font-bold text-red-700">{items.filter(i => i.rpn >= 200).length}</p></div>
                    </div>
                </Card>
                <Card className="bg-yellow-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg"><AlertTriangle className="text-yellow-600" size={20} /></div>
                        <div><p className="text-sm text-yellow-600">Médio Risco (100-199)</p><p className="text-2xl font-bold text-yellow-700">{items.filter(i => i.rpn >= 100 && i.rpn < 200).length}</p></div>
                    </div>
                </Card>
                <Card className="bg-green-50 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg"><AlertTriangle className="text-green-600" size={20} /></div>
                        <div><p className="text-sm text-green-600">Baixo Risco (&lt;100)</p><p className="text-2xl font-bold text-green-700">{items.filter(i => i.rpn < 100).length}</p></div>
                    </div>
                </Card>
            </div>

            <Card padding="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="bg-gray-50">
                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Processo</th>
                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Modo de Falha</th>
                            <th className="text-center py-4 px-4 font-semibold text-gray-700">S</th>
                            <th className="text-center py-4 px-4 font-semibold text-gray-700">O</th>
                            <th className="text-center py-4 px-4 font-semibold text-gray-700">D</th>
                            <th className="text-center py-4 px-4 font-semibold text-gray-700">RPN</th>
                            <th className="text-right py-4 px-4 font-semibold text-gray-700">Ações</th>
                        </tr></thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr><td colSpan={7} className="py-12 text-center text-gray-500">
                                    <AlertTriangle className="mx-auto mb-3 text-gray-300" size={48} /><p>Nenhuma análise FMEA</p>
                                </td></tr>
                            ) : items.map((item) => (
                                <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4 font-medium">{item.processo}</td>
                                    <td className="py-4 px-4 text-sm">{item.modoFalha}</td>
                                    <td className="py-4 px-4 text-center">{item.severidade}</td>
                                    <td className="py-4 px-4 text-center">{item.ocorrencia}</td>
                                    <td className="py-4 px-4 text-center">{item.deteccao}</td>
                                    <td className="py-4 px-4 text-center"><span className={`px-2 py-1 rounded font-bold ${getRPNColor(item.rpn)}`}>{item.rpn}</span></td>
                                    <td className="py-4 px-4">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => { setSelectedItem(item); setFormData(item); setIsModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><Edit size={18} className="text-gray-500" /></button>
                                            <button onClick={() => { if (confirm('Excluir?')) { storage.delete(STORAGE_KEYS.FMEA, item.id); loadItems(); } }} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} className="text-red-500" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedItem(null); }} title={selectedItem ? 'Editar FMEA' : 'Nova Análise FMEA'} size="xl"
                footer={<><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button><Button onClick={handleSubmit}>Salvar</Button></>}>
                <div className="space-y-4">
                    <Input label="Processo/Componente" value={formData.processo} onChange={(e) => setFormData({ ...formData, processo: e.target.value })} required />
                    <Textarea label="Modo de Falha" placeholder="Como a falha pode ocorrer" value={formData.modoFalha} onChange={(e) => setFormData({ ...formData, modoFalha: e.target.value })} rows={2} />
                    <div className="grid grid-cols-2 gap-4">
                        <Textarea label="Efeitos da Falha" value={formData.efeitos} onChange={(e) => setFormData({ ...formData, efeitos: e.target.value })} rows={2} />
                        <Textarea label="Causas Potenciais" value={formData.causas} onChange={(e) => setFormData({ ...formData, causas: e.target.value })} rows={2} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <Select label="Severidade (S)" options={scoreOptions} value={formData.severidade} onChange={(e) => setFormData({ ...formData, severidade: e.target.value })} />
                        <Select label="Ocorrência (O)" options={scoreOptions} value={formData.ocorrencia} onChange={(e) => setFormData({ ...formData, ocorrencia: e.target.value })} />
                        <Select label="Detecção (D)" options={scoreOptions} value={formData.deteccao} onChange={(e) => setFormData({ ...formData, deteccao: e.target.value })} />
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg text-center">
                        <p className="text-sm text-gray-500">RPN Calculado</p>
                        <p className={`text-2xl font-bold ${getRPNColor(calculateRPN(formData.severidade, formData.ocorrencia, formData.deteccao))}`}>
                            {calculateRPN(formData.severidade, formData.ocorrencia, formData.deteccao)}
                        </p>
                    </div>
                    <Textarea label="Ação Recomendada" value={formData.acaoRecomendada} onChange={(e) => setFormData({ ...formData, acaoRecomendada: e.target.value })} rows={2} />
                    <Input label="Responsável" value={formData.responsavel} onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })} />
                </div>
            </Modal>
        </div>
    );
};

export default FMEA;
