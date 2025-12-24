// Módulos Placeholder - para completar depois com funcionalidade completa
import { Card, Button } from '../components/ui';
import { BarChart3, Download, FileText, Calendar } from 'lucide-react';

const Relatorios = () => {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
                    <p className="text-gray-500 mt-1">Gere e exporte relatórios do sistema</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { title: 'Relatório de NCs', desc: 'Não conformidades por período', icon: FileText },
                    { title: 'Relatório de NPS', desc: 'Evolução do NPS ao longo do tempo', icon: BarChart3 },
                    { title: 'Relatório de Reclamações', desc: 'Análise de reclamações de clientes', icon: FileText },
                    { title: 'Relatório de Documentos', desc: 'Status de documentos do sistema', icon: FileText },
                    { title: 'Relatório de Fornecedores', desc: 'Avaliação de fornecedores', icon: FileText },
                    { title: 'Relatório de Auditorias', desc: 'Resumo das auditorias realizadas', icon: Calendar },
                ].map((report, index) => (
                    <Card key={index} hover className="cursor-pointer">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <report.icon className="text-blue-600" size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{report.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{report.desc}</p>
                                <Button variant="ghost" size="sm" icon={Download} className="mt-3">
                                    Exportar
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Relatorios;
