// Dashboard Principal - SGQ ATLAS
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AlertCircle, Megaphone, Smile, Files, Users, ClipboardList, FileCode,
    Workflow, Shield, GitBranch, PieChart, AlertTriangle, TrendingUp,
    Search, Archive, Package, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { Card } from '../components/ui';
import { storage, STORAGE_KEYS } from '../services/storage';

const Dashboard = () => {
    const [stats, setStats] = useState({
        naoConformidades: { total: 0, abertas: 0 },
        reclamacoes: { total: 0, abertas: 0 },
        nps: { total: 0, score: 0 },
        documentos: { total: 0, aprovados: 0 },
        fornecedores: { total: 0, ativos: 0 },
        pops: { total: 0, aprovados: 0 },
        its: { total: 0, aprovados: 0 },
        processos: { total: 0 },
        garantias: { total: 0, ativas: 0 },
        ishikawa: { total: 0 },
        pareto: { total: 0 },
        fmea: { total: 0, altoRisco: 0 },
        melhorias: { total: 0, emAndamento: 0 },
        auditorias: { total: 0, planejadas: 0 },
        quarentena: { total: 0, emQuarentena: 0 },
        amostras: { total: 0, aguardando: 0 }
    });

    useEffect(() => {
        loadAllStats();
    }, []);

    const loadAllStats = () => {
        const ncs = storage.getAll(STORAGE_KEYS.NAO_CONFORMIDADES);
        const reclamacoes = storage.getAll(STORAGE_KEYS.RECLAMACOES);
        const nps = storage.getAll(STORAGE_KEYS.NPS);
        const docs = storage.getAll(STORAGE_KEYS.DOCUMENTOS);
        const fornecedores = storage.getAll(STORAGE_KEYS.FORNECEDORES);
        const pops = storage.getAll(STORAGE_KEYS.POPS);
        const its = storage.getAll(STORAGE_KEYS.ITS);
        const processos = storage.getAll(STORAGE_KEYS.PROCESSOS);
        const garantias = storage.getAll(STORAGE_KEYS.GARANTIAS);
        const ishikawa = storage.getAll(STORAGE_KEYS.ISHIKAWA);
        const pareto = storage.getAll(STORAGE_KEYS.PARETO);
        const fmea = storage.getAll(STORAGE_KEYS.FMEA);
        const melhorias = storage.getAll(STORAGE_KEYS.MELHORIAS);
        const auditorias = storage.getAll(STORAGE_KEYS.AUDITORIAS);
        const quarentena = storage.getAll(STORAGE_KEYS.QUARENTENA);
        const amostras = storage.getAll(STORAGE_KEYS.AMOSTRAS_LOTES);

        // Calculate NPS Score
        const promotores = nps.filter(i => i.nota >= 9).length;
        const detratores = nps.filter(i => i.nota < 7).length;
        const npsScore = nps.length > 0 ? Math.round(((promotores - detratores) / nps.length) * 100) : 0;

        setStats({
            naoConformidades: { total: ncs.length, abertas: ncs.filter(i => i.status === 'aberta').length },
            reclamacoes: { total: reclamacoes.length, abertas: reclamacoes.filter(i => i.status === 'aberta').length },
            nps: { total: nps.length, score: npsScore },
            documentos: { total: docs.length, aprovados: docs.filter(i => i.status === 'aprovado').length },
            fornecedores: { total: fornecedores.length, ativos: fornecedores.filter(i => i.status === 'ativo').length },
            pops: { total: pops.length, aprovados: pops.filter(i => i.status === 'aprovado').length },
            its: { total: its.length, aprovados: its.filter(i => i.status === 'aprovado').length },
            processos: { total: processos.length },
            garantias: { total: garantias.length, ativas: garantias.filter(i => i.status === 'ativa').length },
            ishikawa: { total: ishikawa.length },
            pareto: { total: pareto.length },
            fmea: { total: fmea.length, altoRisco: fmea.filter(i => i.rpn >= 200).length },
            melhorias: { total: melhorias.length, emAndamento: melhorias.filter(i => i.status !== 'concluido').length },
            auditorias: { total: auditorias.length, planejadas: auditorias.filter(i => i.status === 'planejada').length },
            quarentena: { total: quarentena.length, emQuarentena: quarentena.filter(i => i.status === 'quarentena').length },
            amostras: { total: amostras.length, aguardando: amostras.filter(i => i.status === 'aguardando').length }
        });
    };

    const mainKPIs = [
        {
            title: 'Não Conformidades Abertas',
            value: stats.naoConformidades.abertas,
            total: stats.naoConformidades.total,
            change: stats.naoConformidades.abertas > 0 ? '-10%' : '0%',
            changeType: 'negative',
            icon: AlertCircle,
            color: 'red',
            link: '/nao-conformidades'
        },
        {
            title: 'Reclamações de Clientes',
            value: stats.reclamacoes.abertas,
            total: stats.reclamacoes.total,
            change: '+5%',
            changeType: 'positive',
            icon: Megaphone,
            color: 'orange',
            link: '/reclamacoes'
        },
        {
            title: 'Pontuação NPS',
            value: stats.nps.score,
            total: stats.nps.total,
            suffix: '/ 100',
            change: '+15%',
            changeType: 'positive',
            icon: Smile,
            color: 'green',
            link: '/nps'
        }
    ];

    const moduleCards = [
        { title: 'Documentos', value: stats.documentos.total, sub: `${stats.documentos.aprovados} aprovados`, icon: Files, color: 'blue', link: '/documentos' },
        { title: 'Fornecedores', value: stats.fornecedores.total, sub: `${stats.fornecedores.ativos} ativos`, icon: Users, color: 'indigo', link: '/fornecedores' },
        { title: 'POPs', value: stats.pops.total, sub: `${stats.pops.aprovados} aprovados`, icon: ClipboardList, color: 'purple', link: '/pops' },
        { title: 'ITs', value: stats.its.total, sub: `${stats.its.aprovados} aprovadas`, icon: FileCode, color: 'pink', link: '/its' },
        { title: 'Processos BPMN', value: stats.processos.total, sub: 'mapeados', icon: Workflow, color: 'cyan', link: '/processos' },
        { title: 'Garantias', value: stats.garantias.total, sub: `${stats.garantias.ativas} ativas`, icon: Shield, color: 'teal', link: '/garantias' },
        { title: 'Ishikawa', value: stats.ishikawa.total, sub: 'análises', icon: GitBranch, color: 'violet', link: '/ishikawa' },
        { title: 'Pareto', value: stats.pareto.total, sub: 'análises', icon: PieChart, color: 'amber', link: '/pareto' },
        { title: 'FMEA', value: stats.fmea.total, sub: `${stats.fmea.altoRisco} alto risco`, icon: AlertTriangle, color: 'rose', link: '/fmea' },
        { title: 'Melhorias', value: stats.melhorias.total, sub: `${stats.melhorias.emAndamento} em andamento`, icon: TrendingUp, color: 'emerald', link: '/melhorias' },
        { title: 'Auditorias', value: stats.auditorias.total, sub: `${stats.auditorias.planejadas} planejadas`, icon: Search, color: 'sky', link: '/auditorias' },
        { title: 'Quarentena', value: stats.quarentena.emQuarentena, sub: 'itens', icon: Archive, color: 'red', link: '/quarentena' },
        { title: 'Amostras/Lotes', value: stats.amostras.total, sub: `${stats.amostras.aguardando} aguardando`, icon: Package, color: 'lime', link: '/amostras-lotes' }
    ];

    const getColorClasses = (color) => {
        const colors = {
            red: 'bg-red-50 text-red-600',
            orange: 'bg-orange-50 text-orange-600',
            green: 'bg-green-50 text-green-600',
            blue: 'bg-blue-50 text-blue-600',
            indigo: 'bg-indigo-50 text-indigo-600',
            purple: 'bg-purple-50 text-purple-600',
            pink: 'bg-pink-50 text-pink-600',
            cyan: 'bg-cyan-50 text-cyan-600',
            teal: 'bg-teal-50 text-teal-600',
            violet: 'bg-violet-50 text-violet-600',
            amber: 'bg-amber-50 text-amber-600',
            rose: 'bg-rose-50 text-rose-600',
            emerald: 'bg-emerald-50 text-emerald-600',
            sky: 'bg-sky-50 text-sky-600',
            lime: 'bg-lime-50 text-lime-600'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Principal</h1>
                <p className="text-gray-500 mt-1">Visão geral do Sistema de Gestão da Qualidade</p>
            </div>

            {/* Main KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mainKPIs.map((kpi, index) => (
                    <Link key={index} to={kpi.link}>
                        <Card hover className="h-full">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
                                    <div className="flex items-baseline gap-2 mt-2">
                                        <span className="text-4xl font-bold text-gray-900">{kpi.value}</span>
                                        {kpi.suffix && <span className="text-lg text-gray-400">{kpi.suffix}</span>}
                                    </div>
                                    <div className="flex items-center gap-1 mt-2">
                                        {kpi.changeType === 'positive' ? (
                                            <ArrowUpRight className="text-green-500" size={16} />
                                        ) : (
                                            <ArrowDownRight className="text-red-500" size={16} />
                                        )}
                                        <span className={kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                                            {kpi.change}
                                        </span>
                                        <span className="text-gray-400 text-sm">vs mês anterior</span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-xl ${getColorClasses(kpi.color)}`}>
                                    <kpi.icon size={24} />
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Status de Documentos */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Status de Documentos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { title: 'POPs', total: stats.pops.total, approved: stats.pops.aprovados, color: 'purple' },
                        { title: 'ITs', total: stats.its.total, approved: stats.its.aprovados, color: 'pink' },
                        { title: 'BPMN', total: stats.processos.total, approved: stats.processos.total, color: 'cyan' }
                    ].map((doc, index) => (
                        <Card key={index}>
                            <div className="flex items-center justify-between mb-4">
                                <p className="font-medium text-gray-900">{doc.title}</p>
                                <span className="text-2xl font-bold text-gray-900">{doc.total}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Aprovados:</span>
                                <span className="text-sm font-medium text-green-600">{doc.approved}</span>
                            </div>
                            <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${doc.color === 'purple' ? 'bg-purple-500' : doc.color === 'pink' ? 'bg-pink-500' : 'bg-cyan-500'}`}
                                    style={{ width: doc.total > 0 ? `${(doc.approved / doc.total) * 100}%` : '0%' }}
                                />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* All Modules Grid */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Módulos do Sistema</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {moduleCards.map((module, index) => (
                        <Link key={index} to={module.link}>
                            <Card hover className="text-center">
                                <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${getColorClasses(module.color)}`}>
                                    <module.icon size={24} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 mt-3">{module.value}</p>
                                <p className="text-sm font-medium text-gray-700">{module.title}</p>
                                <p className="text-xs text-gray-400">{module.sub}</p>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Acesso Rápido</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/nao-conformidades" className="p-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-center">
                        <AlertCircle className="mx-auto mb-2" size={24} />
                        <p className="font-medium">Nova NC</p>
                    </Link>
                    <Link to="/reclamacoes" className="p-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-center">
                        <Megaphone className="mx-auto mb-2" size={24} />
                        <p className="font-medium">Nova Reclamação</p>
                    </Link>
                    <Link to="/nps" className="p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-center">
                        <Smile className="mx-auto mb-2" size={24} />
                        <p className="font-medium">Nova Pesquisa NPS</p>
                    </Link>
                    <Link to="/auditorias" className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-center">
                        <Search className="mx-auto mb-2" size={24} />
                        <p className="font-medium">Nova Auditoria</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
