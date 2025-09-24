import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    ChevronDown,
    ChevronUp,
    Search,
    Shield,
    Lock,
    Eye,
    Database,
    Settings,
    UserCheck,
    Mail,
    ArrowLeft,
    Calendar,
    FileText
} from "lucide-react";
import config from "@/constants/config";
import Quest2Layout from "@/layouts/quest-2-layout";

interface PrivacySection {
    id: string;
    title: string;
    content: React.ReactNode; // Mudei de string para ReactNode
    category: string;
    lastUpdated?: string;
    tags: string[];
}

interface PrivacyCategory {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
    description: string;
}

export default function Privacy() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const categories: PrivacyCategory[] = [
        {
            id: "collection",
            name: "Coleta de Dados",
            icon: Database,
            color: "bg-blue-500",
            description: "Como coletamos suas informações"
        },
        {
            id: "usage",
            name: "Uso dos Dados",
            icon: Settings,
            color: "bg-green-500",
            description: "Como utilizamos seus dados"
        },
        {
            id: "sharing",
            name: "Compartilhamento",
            icon: UserCheck,
            color: "bg-purple-500",
            description: "Com quem compartilhamos"
        },
        {
            id: "security",
            name: "Segurança",
            icon: Lock,
            color: "bg-red-500",
            description: "Como protegemos seus dados"
        },
        {
            id: "rights",
            name: "Seus Direitos",
            icon: Shield,
            color: "bg-orange-500",
            description: "Seus direitos sobre os dados"
        },
        {
            id: "cookies",
            name: "Cookies",
            icon: Eye,
            color: "bg-teal-500",
            description: "Uso de cookies e rastreamento"
        },
    ];

    const privacySections: PrivacySection[] = [
        {
            id: "1",
            title: "Informações que Coletamos",
            content: (
                <div>
                    <p className="mb-4">Coletamos diferentes tipos de informações quando você usa o {config.app_name}:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">👤 Informações de Conta</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Nome e e-mail</li>
                                <li>• Senha criptografada</li>
                                <li>• Informações de perfil</li>
                            </ul>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">📊 Dados de Uso</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Páginas visitadas</li>
                                <li>• Recursos utilizados</li>
                                <li>• Tempo de sessão</li>
                            </ul>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">🖥️ Informações Técnicas</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Endereço IP</li>
                                <li>• Tipo de navegador</li>
                                <li>• Sistema operacional</li>
                            </ul>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">💬 Dados de Comunicação</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Mensagens de contato</li>
                                <li>• Solicitações de suporte</li>
                                <li>• Feedback fornecido</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs">ℹ️</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Coleta Voluntária:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Todas as informações pessoais são fornecidas voluntariamente por você durante o uso do serviço.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "collection",
            lastUpdated: "2024-01-15",
            tags: ["dados pessoais", "informações técnicas", "coleta"]
        },
        {
            id: "2",
            title: "Como Utilizamos Suas Informações",
            content: (
                <div>
                    <p className="mb-4">Utilizamos suas informações para os seguintes propósitos legítimos:</p>

                    <div className="space-y-4 my-6">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">1</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Prestação de Serviços</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Fornecer, manter e melhorar os recursos do {config.app_name}.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">2</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Comunicação</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Enviar notificações importantes, atualizações de segurança e responder ao suporte.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">3</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Personalização</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Adaptar sua experiência com base em suas preferências e histórico de uso.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">4</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Segurança</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Detectar, prevenir e responder a atividades fraudulentas ou maliciosas.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">5</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Melhoria</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Analisar como nossos serviços são usados para implementar melhorias.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs">✓</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Base Legal:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Todos os usos são baseados em interesse legítimo ou consentimento explícito, conforme a LGPD.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "usage",
            lastUpdated: "2024-01-15",
            tags: ["uso de dados", "personalização", "segurança", "melhorias"]
        },
        {
            id: "3",
            title: "Compartilhamento de Dados",
            content: (
                <div>
                    <p className="mb-4">Respeitamos sua privacidade e limitamos o compartilhamento de dados:</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">✅ Nossa Política</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Nunca vendemos dados</li>
                                <li>• Compartilhamento limitado</li>
                                <li>• Parceiros confiáveis apenas</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🤝 Provedores de Serviço</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Hospedagem segura</li>
                                <li>• Analytics anonimizados</li>
                                <li>• Suporte técnico</li>
                            </ul>
                        </div>
                    </div>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-4">Situações de Compartilhamento:</strong>

                    <div className="space-y-3 my-4">
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <span className="text-yellow-600 dark:text-yellow-400 text-sm">⚖️</span>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100 text-sm">Requisitos Legais:</strong>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Quando exigido por lei ou para proteger nossos direitos.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                            <span className="text-purple-600 dark:text-purple-400 text-sm">🏢</span>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100 text-sm">Transferência de Negócios:</strong>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Em caso de fusão ou aquisição, com notificação prévia.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "sharing",
            lastUpdated: "2024-01-15",
            tags: ["compartilhamento", "terceiros", "provedores", "legal"]
        },
        {
            id: "4",
            title: "Segurança dos Dados",
            content: (
                <div>
                    <p className="mb-4">Implementamos medidas robustas de segurança para proteger suas informações:</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">🔐 Criptografia</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">SSL/TLS em trânsito e AES-256 em repouso</p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">🛡️ Controle de Acesso</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Princípio do menor privilégio aplicado</p>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">👁️ Monitoramento</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Vigilância 24/7 para detectar incidentes</p>
                        </div>
                    </div>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-3">Medidas Adicionais:</strong>

                    <ul className="list-disc list-inside space-y-2 my-4 text-slate-700 dark:text-slate-300">
                        <li><strong className="text-slate-900 dark:text-slate-100">Backups Seguros:</strong> Backups regulares e criptografados armazenados em locais seguros</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Testes de Segurança:</strong> Auditorias regulares e testes de penetração</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Treinamento:</strong> Equipe treinada em melhores práticas de segurança</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Resposta a Incidentes:</strong> Protocolos estabelecidos para resposta rápida</li>
                    </ul>
                </div>
            ),
            category: "security",
            lastUpdated: "2024-01-15",
            tags: ["criptografia", "segurança", "proteção", "monitoramento"]
        },
        {
            id: "5",
            title: "Seus Direitos (LGPD)",
            content: (
                <div>
                    <p className="mb-4">Conforme a Lei Geral de Proteção de Dados, você tem os seguintes direitos:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">📋 Direitos de Informação</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• <strong>Acesso:</strong> Solicitar informações sobre seus dados</li>
                                <li>• <strong>Confirmação:</strong> Confirmar existência do tratamento</li>
                                <li>• <strong>Finalidade:</strong> Conhecer os propósitos do uso</li>
                            </ul>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">✏️ Direitos de Controle</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• <strong>Retificação:</strong> Corrigir dados incorretos</li>
                                <li>• <strong>Exclusão:</strong> Solicitar remoção dos dados</li>
                                <li>• <strong>Oposição:</strong> Opor-se ao processamento</li>
                            </ul>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">📤 Direito à Portabilidade</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Solicitar dados em formato estruturado</li>
                                <li>• Arquivo legível por máquina</li>
                                <li>• Facilitar transferência para outro controlador</li>
                            </ul>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">🏛️ Direitos de Recurso</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Peticionar junto à ANPD</li>
                                <li>• Buscar reparação por danos</li>
                                <li>• Representação junto aos órgãos competentes</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Mail className="w-3 h-3 text-white" />
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Como Exercer seus Direitos:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    Entre em contato através do e-mail: <a href={`mailto:${config.email}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium">{config.email}</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "rights",
            lastUpdated: "2024-01-15",
            tags: ["LGPD", "direitos", "exclusão", "portabilidade", "acesso"]
        },
        {
            id: "6",
            title: "Cookies e Tecnologias Similares",
            content: (
                <div>
                    <p className="mb-4">Utilizamos cookies e tecnologias similares para melhorar sua experiência:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">✅ Cookies Essenciais</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Autenticação segura</li>
                                <li>• Preferências do usuário</li>
                                <li>• Funcionalidade básica</li>
                            </ul>
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-2">Necessários para funcionamento</div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">📊 Cookies de Performance</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Analytics anonimizados</li>
                                <li>• Métricas de uso</li>
                                <li>• Otimização de performance</li>
                            </ul>
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-2">Dados agregados e anônimos</div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">🎨 Cookies de Funcionalidade</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Lembrar escolhas</li>
                                <li>• Personalização da interface</li>
                                <li>• Configurações salvas</li>
                            </ul>
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-2">Melhoram sua experiência</div>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">🔧 Gerenciamento</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Configurações do navegador</li>
                                <li>• Desabilitar cookies não essenciais</li>
                                <li>• Controle total do usuário</li>
                            </ul>
                            <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-2">Você tem controle total</div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs">⚠️</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Cookies de Terceiros:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Alguns parceiros podem definir cookies para analytics e funcionalidades específicas, sempre respeitando sua privacidade.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "cookies",
            lastUpdated: "2024-01-15",
            tags: ["cookies", "rastreamento", "analytics", "funcionalidade"]
        },
        {
            id: "7",
            title: "Retenção de Dados",
            content: (
                <div>
                    <p className="mb-4">Mantemos seus dados pelo tempo necessário para cumprir os propósitos descritos:</p>

                    <div className="space-y-4 my-6">
                        <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm">👤</span>
                            </div>
                            <div>
                                <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Dados de Conta</h5>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Mantidos enquanto sua conta estiver ativa ou conforme necessário para fornecer serviços.</p>
                                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">Período: Duração da conta + 30 dias</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm">📊</span>
                            </div>
                            <div>
                                <h5 className="font-semibold text-green-900 dark:text-green-100 mb-1">Dados de Uso</h5>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Agregados e anonimizados após 24 meses para análises estatísticas.</p>
                                <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">Período: 24 meses (anonimizados)</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm">🔒</span>
                            </div>
                            <div>
                                <h5 className="font-semibold text-orange-900 dark:text-orange-100 mb-1">Logs de Segurança</h5>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Mantidos por até 12 meses para fins de segurança e detecção de fraudes.</p>
                                <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-1">Período: 12 meses (segurança)</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
                        <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">🗑️ Exclusão de Conta</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Quando você excluir sua conta, seus dados pessoais serão removidos em até <strong>30 dias</strong>.
                            Durante este período, você pode reativar sua conta caso deseje.
                        </p>
                    </div>
                </div>
            ),
            category: "usage",
            lastUpdated: "2024-01-15",
            tags: ["retenção", "exclusão", "tempo", "armazenamento"]
        },
        {
            id: "8",
            title: "Menores de Idade",
            content: (
                <div>
                    <p className="mb-4">O {config.app_name} não é destinado a menores de 18 anos:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">🔞 Restrição de Idade</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Serviço para maiores de 18 anos</li>
                                <li>• Verificação na criação da conta</li>
                                <li>• Não coletamos dados de menores</li>
                            </ul>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">👨‍👩‍👧‍👦 Responsabilidade dos Pais</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Monitorar atividade online</li>
                                <li>• Orientar sobre uso seguro</li>
                                <li>• Reportar uso indevido</li>
                            </ul>
                        </div>
                    </div>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-3">Procedimentos de Proteção:</strong>

                    <div className="space-y-3 my-4">
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <span className="text-yellow-600 dark:text-yellow-400 text-sm">🔍</span>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100 text-sm">Descoberta Acidental:</strong>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Se descobrirmos que coletamos dados de um menor, excluiremos essas informações prontamente.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <span className="text-blue-600 dark:text-blue-400 text-sm">📞</span>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100 text-sm">Reporte Imediato:</strong>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Pais podem reportar uso não autorizado através do nosso canal de suporte.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "rights",
            lastUpdated: "2024-01-15",
            tags: ["menores", "idade", "proteção", "responsabilidade"]
        }
    ];

    const toggleItem = (id: string) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(id)) {
            newOpenItems.delete(id);
        } else {
            newOpenItems.add(id);
        }
        setOpenItems(newOpenItems);
    };

    const filteredItems = privacySections.filter(item => {
        const matchesSearch = searchTerm === "" ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (typeof item.content === "string"
                ? item.content.toLowerCase().includes(searchTerm.toLowerCase())
                : (typeof item.content === "object" && item.content !== null
                    ? (function getTextFromReactNode(node: React.ReactNode): string {
                        if (typeof node === "string") return node;
                        if (typeof node === "number" || typeof node === "boolean") return node.toString();
                        if (Array.isArray(node)) return node.map(getTextFromReactNode).join(" ");
                        if (node && typeof node === "object" && "props" in node) {
                            // @ts-ignore
                            return getTextFromReactNode(node.props?.children);
                        }
                        return "";
                    })(item.content).toLowerCase().includes(searchTerm.toLowerCase())
                    : false
                )
            ) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === null || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const getCategoryCount = (categoryId: string) => {
        return privacySections.filter(item => item.category === categoryId).length;
    };

    const handleEmailPrivacy = () => {
        const email = config.email || '';
        const subject = `Dúvida sobre Privacidade - ${config.app_name}`;
        const body = `Olá equipe de privacidade do ${config.app_name},\n\nTenho uma dúvida sobre a política de privacidade:\n\n[Descreva sua dúvida aqui]\n\nAguardo retorno.\n\nObrigado!`;

        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        return url;
    };

    return (
        <>
            <Head title="Política de Privacidade" />
            <Quest2Layout
                title="Política de Privacidade"
                subtitle={`Saiba como o ${config.app_name} coleta, usa e protege suas informações pessoais. Sua privacidade é nossa prioridade.`}
                icon={<Shield className="w-10 h-10 text-white" />}
            >
                {/* Estatísticas */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-slate-400 mb-12">
                    <span className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="hidden sm:inline">{privacySections.length} seções detalhadas</span>
                        <span className="sm:hidden">{privacySections.length} seções</span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="hidden sm:inline">{categories.length} categorias</span>
                        <span className="sm:hidden">{categories.length} cats</span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="hidden sm:inline">Atualizado em Janeiro/2024</span>
                        <span className="sm:hidden">Jan/2024</span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="hidden sm:inline">Conforme LGPD</span>
                        <span className="sm:hidden">LGPD</span>
                    </span>
                </div>

                {/* Alert Box */}
                <div className="mb-12">
                    <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                        Compromisso com sua Privacidade
                                    </h3>
                                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                                        Esta política foi atualizada para estar em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong>.
                                        Estamos comprometidos em proteger suas informações pessoais e dar a você controle total sobre seus dados.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <div className="mb-12">
                    <div className="relative mb-6 sm:mb-8">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Pesquisar tópicos de privacidade, direitos ou termos específicos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500 rounded-xl shadow-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isSelected = selectedCategory === category.id;
                            const count = getCategoryCount(category.id);

                            return (
                                <Card
                                    key={category.id}
                                    className={cn(
                                        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2",
                                        isSelected
                                            ? "border-blue-500 shadow-lg bg-blue-50 dark:bg-blue-900/20 scale-105"
                                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                                    )}
                                    onClick={() => setSelectedCategory(
                                        selectedCategory === category.id ? null : category.id
                                    )}
                                >
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className={cn(
                                                "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200",
                                                category.color,
                                                isSelected && "scale-110"
                                            )}>
                                                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base mb-1">
                                                    {category.name}
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3">
                                                    {category.description}
                                                </p>
                                                <Badge
                                                    variant={isSelected ? "default" : "secondary"}
                                                    className="text-xs"
                                                >
                                                    {count} {count === 1 ? 'seção' : 'seções'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Results Summary */}
                {(searchTerm || selectedCategory) && (
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 gap-3 sm:gap-0">
                            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                                <span className="font-semibold">
                                    {filteredItems.length} {filteredItems.length === 1 ? 'seção encontrada' : 'seções encontradas'}
                                </span>
                                {selectedCategory && (
                                    <span className="ml-2 block sm:inline">
                                        na categoria <strong>"{categories.find(c => c.id === selectedCategory)?.name}"</strong>
                                    </span>
                                )}
                                {searchTerm && (
                                    <span className="ml-2 block sm:inline">
                                        para <strong>"{searchTerm}"</strong>
                                    </span>
                                )}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory(null);
                                }}
                                className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 w-full sm:w-auto"
                            >
                                Limpar filtros
                            </Button>
                        </div>
                    </div>
                )}

                {/* Privacy Sections */}
                <div className="space-y-3">
                    {filteredItems.length === 0 ? (
                        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <CardContent className="p-8 sm:p-12 text-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                                    Nenhuma seção encontrada
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                                    Não encontramos seções que correspondam à sua pesquisa.
                                    Tente usar termos diferentes ou entre em contato conosco.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedCategory(null);
                                        }}
                                        className="w-full sm:w-auto"
                                    >
                                        Limpar pesquisa
                                    </Button>
                                    <Button asChild className="w-full sm:w-auto">
                                        <a href={handleEmailPrivacy()}>
                                            <Mail className="w-4 h-4 mr-2" />
                                            Dúvidas sobre privacidade
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredItems.map((item, index) => {
                            const isOpen = openItems.has(item.id);
                            const category = categories.find(c => c.id === item.category);

                            return (
                                <Card
                                    key={item.id}
                                    className={cn(
                                        "border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-800",
                                        isOpen && "shadow-md border-blue-200 dark:border-blue-700"
                                    )}
                                >
                                    <CardContent className="p-0">
                                        <button
                                            onClick={() => toggleItem(item.id)}
                                            className="w-full p-4 sm:p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between group"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                                    <span className="text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-500">
                                                        #{String(index + 1).padStart(2, '0')}
                                                    </span>
                                                    {category && (
                                                        <div className={cn(
                                                            "w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center",
                                                            category.color
                                                        )}>
                                                            <category.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                                        </div>
                                                    )}
                                                    <Badge variant="outline" className="text-xs">
                                                        <span className="hidden sm:inline">{category?.name}</span>
                                                        <span className="sm:hidden">{category?.name.split(' ')[0]}</span>
                                                    </Badge>
                                                    {item.lastUpdated && (
                                                        <Badge variant="secondary" className="text-xs inline-flex">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            <span className="hidden sm:inline">{new Date(item.lastUpdated).toLocaleDateString('pt-BR')}</span>
                                                            <span className="sm:hidden">{new Date(item.lastUpdated).toLocaleDateString('pt-BR', { month: '2-digit', year: '2-digit' })}</span>
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-2">
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                                                    isOpen ? "bg-blue-100 dark:bg-blue-900/50" : "bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                                                )}>
                                                    {isOpen ? (
                                                        <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>

                                        {isOpen && (
                                            <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                                                <div className="pt-4 sm:pt-6">
                                                    <div className="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base">
                                                        <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                            {item.content}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
                                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-2">
                                                            Tags relacionadas:
                                                        </span>
                                                        {item.tags.map((tag) => (
                                                            <Badge
                                                                key={tag}
                                                                variant="secondary"
                                                                className="text-xs hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSearchTerm(tag);
                                                                }}
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Contact Section */}
                <div className="mt-16 sm:mt-20">
                    <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
                        <CardContent className="p-6 sm:p-8 text-center relative">
                            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200 dark:bg-blue-900/30 rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16 opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-18 h-18 sm:w-24 sm:h-24 bg-blue-300 dark:bg-blue-800/30 rounded-full translate-y-9 -translate-x-9 sm:translate-y-12 sm:-translate-x-12 opacity-30"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                                    <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">
                                    Dúvidas sobre Privacidade?
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg">
                                    Se você tem dúvidas sobre como tratamos seus dados ou deseja exercer seus direitos,
                                    nossa equipe de privacidade está pronta para ajudar.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" asChild className="w-full sm:w-auto">
                                        <a href={handleEmailPrivacy()}>
                                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Contato sobre Privacidade
                                        </a>
                                    </Button>
                                    <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                                        <Link href="/">
                                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Voltar ao início
                                        </Link>
                                    </Button>
                                </div>
                                <div className="mt-4 sm:mt-6 text-sm text-slate-500 dark:text-slate-400">
                                    Respondemos solicitações de privacidade em até 15 dias úteis
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Quest2Layout>

            <style>{`
                .prose p {
                    margin-bottom: 1rem;
                }
                .prose strong {
                    font-weight: 600;
                }
                .dark .prose strong {
                    color: #f1f5f9;
                }
            `}</style>
        </>
    );
}
