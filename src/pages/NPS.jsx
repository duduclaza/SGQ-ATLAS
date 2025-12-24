// NPS Module - Net Promoter Score with Dynamic Forms (like SGQDJ)
import { useState, useEffect, useMemo } from 'react';
import {
    Plus, Search, FileText, BarChart3, Link2, Copy, Edit, Trash2, Eye, Lock, Unlock,
    Smile, Meh, Frown, TrendingUp, Users, X, CheckCircle, QrCode, ExternalLink
} from 'lucide-react';
import { Button, Card, Input, Modal, Select, Textarea } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const TIPO_PERGUNTA_OPTIONS = [
    { value: 'texto', label: 'Resposta de Texto' },
    { value: 'numero', label: 'Resposta Numérica (0-10)' },
    { value: 'sim_nao', label: 'Sim/Não' },
    { value: 'multipla', label: 'Múltipla Escolha' }
];

const NPS = () => {
    const [activeView, setActiveView] = useState('formularios'); // 'formularios' | 'dashboard' | 'responder'
    const [formularios, setFormularios] = useState([]);
    const [respostas, setRespostas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
    const [isRespostasModalOpen, setIsRespostasModalOpen] = useState(false);
    const [selectedFormulario, setSelectedFormulario] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        perguntas: [{ texto: '', tipo: 'texto' }],
        ativo: true
    });

    // Form response data
    const [responseData, setResponseData] = useState({
        nome: '',
        email: '',
        respostas: []
    });

    useEffect(() => {
        loadFormularios();
        loadRespostas();
    }, []);

    const loadFormularios = () => setFormularios(storage.getAll(STORAGE_KEYS.NPS_FORMULARIOS));
    const loadRespostas = () => setRespostas(storage.getAll(STORAGE_KEYS.NPS_RESPOSTAS));

    // Stats
    const stats = useMemo(() => {
        const totalFormularios = formularios.length;
        const formulariosAtivos = formularios.filter(f => f.ativo).length;
        const totalRespostas = respostas.length;

        // Calculate NPS from all numeric responses (0-10)
        const numericRespostas = respostas.flatMap(r =>
            r.respostas?.filter(resp => typeof resp.valor === 'number') || []
        );

        const promotores = numericRespostas.filter(r => r.valor >= 9).length;
        const detratores = numericRespostas.filter(r => r.valor <= 6).length;
        const npsScore = numericRespostas.length > 0
            ? Math.round(((promotores - detratores) / numericRespostas.length) * 100)
            : 0;

        return { totalFormularios, formulariosAtivos, totalRespostas, npsScore };
    }, [formularios, respostas]);

    const getRespostasCount = (formularioId) => {
        return respostas.filter(r => r.formularioId === formularioId).length;
    };

    const handleSubmit = () => {
        if (!formData.titulo.trim()) {
            alert('Título é obrigatório');
            return;
        }
        if (formData.perguntas.length === 0 || !formData.perguntas.some(p => p.texto.trim())) {
            alert('Adicione pelo menos uma pergunta');
            return;
        }

        // Filter out empty questions
        const cleanPerguntas = formData.perguntas.filter(p => p.texto.trim());
        const dataToSave = { ...formData, perguntas: cleanPerguntas };

        if (selectedFormulario) {
            storage.update(STORAGE_KEYS.NPS_FORMULARIOS, selectedFormulario.id, dataToSave);
        } else {
            storage.add(STORAGE_KEYS.NPS_FORMULARIOS, dataToSave);
        }

        loadFormularios();
        handleCloseModal();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFormulario(null);
        setFormData({
            titulo: '',
            descricao: '',
            perguntas: [{ texto: '', tipo: 'texto' }],
            ativo: true
        });
    };

    const handleEdit = (formulario) => {
        const count = getRespostasCount(formulario.id);
        if (count > 0) {
            alert(`Não é possível editar! Este formulário possui ${count} resposta(s).`);
            return;
        }
        setSelectedFormulario(formulario);
        setFormData({
            titulo: formulario.titulo || '',
            descricao: formulario.descricao || '',
            perguntas: formulario.perguntas || [{ texto: '', tipo: 'texto' }],
            ativo: formulario.ativo !== false
        });
        setIsModalOpen(true);
    };

    const handleDelete = (formulario) => {
        const count = getRespostasCount(formulario.id);
        if (count > 0) {
            alert(`Não é possível excluir! Este formulário possui ${count} resposta(s).`);
            return;
        }
        if (confirm('Tem certeza que deseja excluir este formulário?')) {
            storage.delete(STORAGE_KEYS.NPS_FORMULARIOS, formulario.id);
            loadFormularios();
        }
    };

    const handleToggleStatus = (formulario) => {
        storage.update(STORAGE_KEYS.NPS_FORMULARIOS, formulario.id, { ativo: !formulario.ativo });
        loadFormularios();
    };

    const handleViewRespostas = (formulario) => {
        setSelectedFormulario(formulario);
        setIsRespostasModalOpen(true);
    };

    const handleOpenResponder = (formulario) => {
        if (!formulario.ativo) {
            alert('Este formulário está inativo e não aceita novas respostas.');
            return;
        }
        setSelectedFormulario(formulario);
        setResponseData({
            nome: '',
            email: '',
            respostas: formulario.perguntas.map(() => ({ valor: '' }))
        });
        setIsRespondModalOpen(true);
    };

    const handleSubmitResponse = () => {
        if (!responseData.nome.trim()) {
            alert('Nome é obrigatório');
            return;
        }
        if (!responseData.email.trim() || !responseData.email.includes('@')) {
            alert('Email válido é obrigatório');
            return;
        }

        // Validate all responses are filled
        const hasEmptyResponse = responseData.respostas.some((r, i) => {
            const pergunta = selectedFormulario.perguntas[i];
            return pergunta && !r.valor && r.valor !== 0;
        });

        if (hasEmptyResponse) {
            alert('Por favor, responda todas as perguntas');
            return;
        }

        const respostaData = {
            formularioId: selectedFormulario.id,
            formularioTitulo: selectedFormulario.titulo,
            nome: responseData.nome,
            email: responseData.email,
            respostas: selectedFormulario.perguntas.map((p, i) => ({
                pergunta: p.texto,
                tipo: p.tipo,
                valor: responseData.respostas[i]?.valor
            })),
            respondidoEm: new Date().toISOString()
        };

        storage.add(STORAGE_KEYS.NPS_RESPOSTAS, respostaData);
        loadRespostas();
        setIsRespondModalOpen(false);
        setSelectedFormulario(null);
        alert('Obrigado por responder! Sua opinião é muito importante para nós.');
    };

    const addPergunta = () => {
        setFormData({
            ...formData,
            perguntas: [...formData.perguntas, { texto: '', tipo: 'texto' }]
        });
    };

    const removePergunta = (index) => {
        if (formData.perguntas.length <= 1) return;
        const newPerguntas = formData.perguntas.filter((_, i) => i !== index);
        setFormData({ ...formData, perguntas: newPerguntas });
    };

    const updatePergunta = (index, field, value) => {
        const newPerguntas = [...formData.perguntas];
        newPerguntas[index] = { ...newPerguntas[index], [field]: value };
        setFormData({ ...formData, perguntas: newPerguntas });
    };

    const copyLink = (id) => {
        const link = `${window.location.origin}/nps?responder=${id}`;
        navigator.clipboard.writeText(link);
        alert('Link copiado para a área de transferência!');
    };

    const filteredFormularios = formularios.filter(f =>
        f.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formularioRespostas = selectedFormulario
        ? respostas.filter(r => r.formularioId === selectedFormulario.id)
        : [];

    const getNpsColor = (score) => {
        if (score >= 50) return 'text-green-600';
        if (score >= 0) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Formulários NPS</h1>
                    <p className="text-gray-500 mt-1">Crie formulários personalizados e colete feedback dos clientes</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setActiveView('dashboard')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeView === 'dashboard'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <BarChart3 size={18} />
                        Dashboard
                    </button>
                    <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                        Novo Formulário
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <FileText className="text-white" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-blue-100">Formulários</p>
                            <p className="text-2xl font-bold text-white">{stats.totalFormularios}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-r from-green-600 to-green-700 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Unlock className="text-white" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-green-100">Ativos</p>
                            <p className="text-2xl font-bold text-white">{stats.formulariosAtivos}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-r from-purple-600 to-purple-700 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Users className="text-white" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-purple-100">Respostas</p>
                            <p className="text-2xl font-bold text-white">{stats.totalRespostas}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-r from-slate-700 to-slate-800 border-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <TrendingUp className="text-white" size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-300">Score NPS</p>
                            <p className={`text-2xl font-bold ${stats.npsScore >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {stats.npsScore}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar formulários..."
                    className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Formularios Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFormularios.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <FileText className="mx-auto mb-3 text-gray-300" size={48} />
                        <p className="text-gray-500 mb-4">Nenhum formulário criado ainda</p>
                        <Button variant="ghost" onClick={() => setIsModalOpen(true)}>
                            Criar primeiro formulário
                        </Button>
                    </div>
                ) : (
                    filteredFormularios.map((formulario) => (
                        <Card key={formulario.id} className="hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{formulario.titulo}</h3>
                                    {formulario.descricao && (
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{formulario.descricao}</p>
                                    )}
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${formulario.ativo
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {formulario.ativo ? '✓ Ativo' : '✗ Inativo'}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <span className="flex items-center gap-1">
                                    <FileText size={14} />
                                    {formulario.perguntas?.length || 0} perguntas
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users size={14} />
                                    {getRespostasCount(formulario.id)} respostas
                                </span>
                            </div>

                            <div className="text-xs text-gray-400 mb-4">
                                Criado em: {new Date(formulario.createdAt).toLocaleDateString('pt-BR')}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleOpenResponder(formulario)}
                                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Responder"
                                    >
                                        <ExternalLink size={16} className="text-blue-500" />
                                    </button>
                                    <button
                                        onClick={() => copyLink(formulario.id)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Copiar link"
                                    >
                                        <Link2 size={16} className="text-gray-500" />
                                    </button>
                                    <button
                                        onClick={() => handleViewRespostas(formulario)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Ver respostas"
                                    >
                                        <Eye size={16} className="text-gray-500" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleToggleStatus(formulario)}
                                        className={`p-2 rounded-lg transition-colors ${formulario.ativo
                                                ? 'hover:bg-green-50 text-green-600'
                                                : 'hover:bg-gray-100 text-gray-400'
                                            }`}
                                        title={formulario.ativo ? 'Desativar' : 'Ativar'}
                                    >
                                        {formulario.ativo ? <Unlock size={16} /> : <Lock size={16} />}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(formulario)}
                                        className={`p-2 rounded-lg transition-colors ${getRespostasCount(formulario.id) > 0
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : 'hover:bg-gray-100 text-gray-500'
                                            }`}
                                        title={getRespostasCount(formulario.id) > 0 ? 'Não pode editar (tem respostas)' : 'Editar'}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(formulario)}
                                        className={`p-2 rounded-lg transition-colors ${getRespostasCount(formulario.id) > 0
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : 'hover:bg-red-50 text-red-500'
                                            }`}
                                        title={getRespostasCount(formulario.id) > 0 ? 'Não pode excluir (tem respostas)' : 'Excluir'}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedFormulario ? 'Editar Formulário' : 'Novo Formulário'}
                size="xl"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleSubmit}>
                            {selectedFormulario ? 'Salvar Alterações' : 'Criar Formulário'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <Input
                        label="Título do Formulário"
                        placeholder="Ex: Pesquisa de Satisfação - Cliente"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        required
                    />

                    <Textarea
                        label="Descrição (opcional)"
                        placeholder="Breve descrição sobre o formulário"
                        value={formData.descricao}
                        onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                        rows={2}
                    />

                    {/* Perguntas Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-semibold text-gray-700">Perguntas</label>
                            <button
                                type="button"
                                onClick={addPergunta}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                <Plus size={16} />
                                Adicionar Pergunta
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.perguntas.map((pergunta, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-medium text-gray-700">
                                            Pergunta {index + 1}
                                        </span>
                                        {formData.perguntas.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePergunta(index)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Remover
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Digite a pergunta"
                                        className="w-full h-12 px-4 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        value={pergunta.texto}
                                        onChange={(e) => updatePergunta(index, 'texto', e.target.value)}
                                    />
                                    <select
                                        className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        value={pergunta.tipo}
                                        onChange={(e) => updatePergunta(index, 'tipo', e.target.value)}
                                    >
                                        {TIPO_PERGUNTA_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Respond Modal */}
            <Modal
                isOpen={isRespondModalOpen}
                onClose={() => setIsRespondModalOpen(false)}
                title={selectedFormulario?.titulo || 'Responder Formulário'}
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsRespondModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSubmitResponse}>Enviar Respostas</Button>
                    </>
                }
            >
                {selectedFormulario && (
                    <div className="space-y-6">
                        {selectedFormulario.descricao && (
                            <p className="text-gray-600 bg-blue-50 p-4 rounded-lg">{selectedFormulario.descricao}</p>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Seu Nome"
                                placeholder="Digite seu nome"
                                value={responseData.nome}
                                onChange={(e) => setResponseData({ ...responseData, nome: e.target.value })}
                                required
                            />
                            <Input
                                label="Seu Email"
                                type="email"
                                placeholder="seu@email.com"
                                value={responseData.email}
                                onChange={(e) => setResponseData({ ...responseData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="border-t pt-6 space-y-6">
                            {selectedFormulario.perguntas?.map((pergunta, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-900 mb-3">
                                        {index + 1}. {pergunta.texto} *
                                    </label>

                                    {pergunta.tipo === 'texto' && (
                                        <textarea
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            rows={3}
                                            placeholder="Digite sua resposta"
                                            value={responseData.respostas[index]?.valor || ''}
                                            onChange={(e) => {
                                                const newRespostas = [...responseData.respostas];
                                                newRespostas[index] = { valor: e.target.value };
                                                setResponseData({ ...responseData, respostas: newRespostas });
                                            }}
                                        />
                                    )}

                                    {pergunta.tipo === 'numero' && (
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500">0</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="10"
                                                className="flex-1"
                                                value={responseData.respostas[index]?.valor || 5}
                                                onChange={(e) => {
                                                    const newRespostas = [...responseData.respostas];
                                                    newRespostas[index] = { valor: parseInt(e.target.value) };
                                                    setResponseData({ ...responseData, respostas: newRespostas });
                                                }}
                                            />
                                            <span className="text-sm text-gray-500">10</span>
                                            <span className="text-lg font-bold text-blue-600 w-8 text-center">
                                                {responseData.respostas[index]?.valor ?? 5}
                                            </span>
                                        </div>
                                    )}

                                    {pergunta.tipo === 'sim_nao' && (
                                        <div className="flex gap-4">
                                            {['Sim', 'Não'].map(opt => (
                                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name={`resposta_${index}`}
                                                        value={opt}
                                                        checked={responseData.respostas[index]?.valor === opt}
                                                        onChange={(e) => {
                                                            const newRespostas = [...responseData.respostas];
                                                            newRespostas[index] = { valor: e.target.value };
                                                            setResponseData({ ...responseData, respostas: newRespostas });
                                                        }}
                                                        className="w-4 h-4"
                                                    />
                                                    <span>{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {pergunta.tipo === 'multipla' && (
                                        <select
                                            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            value={responseData.respostas[index]?.valor || ''}
                                            onChange={(e) => {
                                                const newRespostas = [...responseData.respostas];
                                                newRespostas[index] = { valor: e.target.value };
                                                setResponseData({ ...responseData, respostas: newRespostas });
                                            }}
                                        >
                                            <option value="">Selecione uma opção</option>
                                            <option value="Ótimo">Ótimo</option>
                                            <option value="Bom">Bom</option>
                                            <option value="Regular">Regular</option>
                                            <option value="Ruim">Ruim</option>
                                            <option value="Péssimo">Péssimo</option>
                                        </select>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>

            {/* View Respostas Modal */}
            <Modal
                isOpen={isRespostasModalOpen}
                onClose={() => { setIsRespostasModalOpen(false); setSelectedFormulario(null); }}
                title={`Respostas: ${selectedFormulario?.titulo || ''}`}
                size="xl"
            >
                {selectedFormulario && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                            <span className="text-blue-700 font-medium">
                                Total de respostas: {formularioRespostas.length}
                            </span>
                        </div>

                        {formularioRespostas.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Users className="mx-auto mb-3 text-gray-300" size={48} />
                                <p>Nenhuma resposta recebida ainda</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                {formularioRespostas.map((resposta, idx) => (
                                    <div key={resposta.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="font-medium text-gray-900">{resposta.nome}</p>
                                                <p className="text-sm text-gray-500">{resposta.email}</p>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(resposta.respondidoEm || resposta.createdAt).toLocaleString('pt-BR')}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {resposta.respostas?.map((r, i) => (
                                                <div key={i} className="text-sm">
                                                    <span className="text-gray-600">{r.pergunta}: </span>
                                                    <span className="font-medium text-gray-900">
                                                        {r.tipo === 'numero' ? (
                                                            <span className={`${r.valor >= 9 ? 'text-green-600' : r.valor >= 7 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                                {r.valor}/10
                                                            </span>
                                                        ) : r.valor}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default NPS;
