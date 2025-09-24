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
    BookOpen,
    Play,
    User,
    Settings,
    Shield,
    Zap,
    BarChart3,
    HelpCircle,
    Mail,
    ArrowLeft,
    Calendar,
    Clock,
    CheckCircle,
    AlertTriangle,
    Info,
    ExternalLink,
    Download,
    Video
} from "lucide-react";
import config from "@/constants/config";
import Quest2Layout from "@/layouts/quest-2-layout";

interface ManualSection {
    id: string;
    title: string;
    content: React.ReactNode;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: string;
    lastUpdated?: string;
    tags: string[];
    hasVideo?: boolean;
    hasDownload?: boolean;
}

interface ManualCategory {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
    description: string;
}

export default function UserManual() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const categories: ManualCategory[] = [
        {
            id: "getting-started",
            name: "Primeiros Passos",
            icon: Play,
            color: "bg-green-500",
            description: "Como começar a usar o sistema"
        },
        {
            id: "account",
            name: "Conta e Perfil",
            icon: User,
            color: "bg-blue-500",
            description: "Gerenciar sua conta pessoal"
        },
        {
            id: "features",
            name: "Funcionalidades",
            icon: Zap,
            color: "bg-purple-500",
            description: "Todos os recursos disponíveis"
        },
        {
            id: "settings",
            name: "Configurações",
            icon: Settings,
            color: "bg-orange-500",
            description: "Personalizar sua experiência"
        },
        {
            id: "security",
            name: "Segurança",
            icon: Shield,
            color: "bg-red-500",
            description: "Proteger sua conta e dados"
        },
        {
            id: "reports",
            name: "Relatórios",
            icon: BarChart3,
            color: "bg-teal-500",
            description: "Gerar e analisar relatórios"
        }
    ];

    const manualSections: ManualSection[] = [
        {
            id: "1",
            title: "Criando sua primeira conta",
            content: (
                <div>
                    <p className="mb-4">Bem-vindo ao {config.app_name}! Este guia irá te ajudar a criar sua conta e dar os primeiros passos.</p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">1</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Acesse a página de registro</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Clique em "Registrar" no canto superior direito da página inicial.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">2</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Preencha seus dados</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Insira seu nome completo, e-mail válido e uma senha segura.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">3</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Verifique seu e-mail</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Acesse sua caixa de entrada e clique no link de verificação.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Pronto!</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Sua conta foi criada com sucesso e você já pode fazer login.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "getting-started",
            difficulty: "beginner",
            estimatedTime: "5 min",
            lastUpdated: "2024-01-15",
            tags: ["registro", "conta", "primeiro acesso", "email"],
            hasVideo: true
        },
        {
            id: "2",
            title: "Navegando pelo Dashboard",
            content: (
                <div>
                    <p className="mb-4">O dashboard é sua central de controle no {config.app_name}. Aqui você encontra todas as informações importantes.</p>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-4">Áreas principais do Dashboard:</strong>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">📊 Visão Geral</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Métricas e estatísticas importantes sobre sua conta.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">📋 Atividades Recentes</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Histórico das suas últimas ações no sistema.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">🔔 Notificações</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Alertas e mensagens importantes do sistema.</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">⚡ Ações Rápidas</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Acesso direto às funcionalidades mais usadas.</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs">💡</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Dica:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Use os atalhos de teclado para navegar mais rapidamente. Pressione Ctrl+K para abrir a busca global.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "getting-started",
            difficulty: "beginner",
            estimatedTime: "10 min",
            lastUpdated: "2024-01-15",
            tags: ["dashboard", "navegação", "interface", "atalhos"],
            hasVideo: true
        },
        {
            id: "3",
            title: "Configurando seu Perfil",
            content: (
                <div>
                    <p className="mb-4">Personalize sua conta alterando informações do perfil, foto e preferências.</p>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-3">Como acessar as configurações:</strong>

                    <ol className="list-decimal list-inside space-y-2 my-4 text-slate-700 dark:text-slate-300">
                        <li>Clique no seu avatar no canto superior direito</li>
                        <li>Selecione "Configurações" no menu dropdown</li>
                        <li>Navegue pelas abas: Perfil, Segurança, Notificações</li>
                    </ol>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-3">Informações que você pode alterar:</strong>

                    <ul className="list-disc list-inside space-y-1 my-4 text-slate-700 dark:text-slate-300">
                        <li><strong className="text-slate-900 dark:text-slate-100">Foto do perfil:</strong> Upload de imagem (máx. 2MB, JPG/PNG)</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Nome completo:</strong> Como seu nome aparece no sistema</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">E-mail:</strong> Endereço principal para comunicações</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Telefone:</strong> Para verificação em duas etapas</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Fuso horário:</strong> Ajusta horários no sistema</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Idioma:</strong> Interface em português ou inglês</li>
                    </ul>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <AlertTriangle className="w-3 h-3 text-white" />
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Importante:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Ao alterar o e-mail, você precisará verificar o novo endereço antes que a mudança seja efetivada.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "account",
            difficulty: "beginner",
            estimatedTime: "15 min",
            lastUpdated: "2024-01-15",
            tags: ["perfil", "configurações", "foto", "informações pessoais"]
        },
        {
            id: "4",
            title: "Ativando Autenticação em Duas Etapas",
            content: (
                <div>
                    <p className="mb-4">A autenticação em duas etapas (2FA) adiciona uma camada extra de segurança à sua conta.</p>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-4">Métodos disponíveis:</strong>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📱 Aplicativo Autenticador</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Use Google Authenticator, Authy ou similar.</p>
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">✅ Recomendado</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">📧 E-mail</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Código enviado para seu e-mail.</p>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Menos seguro que o app</div>
                        </div>
                    </div>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-4">Passo a passo para configurar:</strong>

                    <div className="space-y-4 my-6">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">1</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Baixe um aplicativo autenticador</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Google Authenticator (iOS/Android) ou Authy (iOS/Android/Desktop)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">2</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Acesse Configurações {">"} Segurança</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Encontre a seção "Autenticação em Duas Etapas"</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">3</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Escaneie o QR Code</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Use a câmera do app para escanear o código</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">4</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Digite o código de verificação</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Insira o código de 6 dígitos gerado pelo app</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">✓</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Salve os códigos de recuperação</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Guarde em local seguro para emergências</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "security",
            difficulty: "intermediate",
            estimatedTime: "20 min",
            lastUpdated: "2024-01-15",
            tags: ["2fa", "segurança", "autenticação", "configuração"],
            hasVideo: true
        },
        {
            id: "5",
            title: "Gerando Relatórios Avançados",
            content: (
                <div>
                    <p className="mb-4">Aprenda a criar relatórios personalizados e extrair insights valiosos dos seus dados.</p>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-4">Tipos de relatórios disponíveis:</strong>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">📈 Performance</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Métricas de desempenho e crescimento</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">👥 Usuários</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Atividade e comportamento dos usuários</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">💰 Financeiro</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Receitas, custos e análise financeira</p>
                        </div>
                    </div>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-4">Como criar um relatório personalizado:</strong>

                    <ol className="list-decimal list-inside space-y-3 my-6 text-slate-700 dark:text-slate-300">
                        <li><strong className="text-slate-900 dark:text-slate-100">Acesse a seção Relatórios</strong>
                            <p className="text-sm text-slate-600 dark:text-slate-400 ml-6">Menu principal {">"} Relatórios {">"} Novo Relatório</p>
                        </li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Escolha o tipo de dados</strong>
                            <p className="text-sm text-slate-600 dark:text-slate-400 ml-6">Selecione quais informações deseja incluir</p>
                        </li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Defina filtros</strong>
                            <p className="text-sm text-slate-600 dark:text-slate-400 ml-6">Período, categorias, usuários específicos, etc.</p>
                        </li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Configure visualização</strong>
                            <p className="text-sm text-slate-600 dark:text-slate-400 ml-6">Gráficos, tabelas, formato de exportação</p>
                        </li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Gere e exporte</strong>
                            <p className="text-sm text-slate-600 dark:text-slate-400 ml-6">PDF, Excel, CSV ou visualização online</p>
                        </li>
                    </ol>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs">💡</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Dica Pro:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Salve seus relatórios favoritos como templates para reutilizar rapidamente no futuro.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "reports",
            difficulty: "advanced",
            estimatedTime: "30 min",
            lastUpdated: "2024-01-15",
            tags: ["relatórios", "analytics", "dados", "exportação"],
            hasVideo: true,
            hasDownload: true
        },
        {
            id: "6",
            title: "Atalhos de Teclado Essenciais",
            content: (
                <div>
                    <p className="mb-4">Aumente sua produtividade conhecendo os principais atalhos do {config.app_name}.</p>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-4">Navegação Geral:</strong>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Busca global</span>
                                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-700 dark:text-slate-300">Ctrl + K</kbd>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Ir para dashboard</span>
                                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-700 dark:text-slate-300">Ctrl + H</kbd>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Configurações</span>
                                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-700 dark:text-slate-300">Ctrl + ,</kbd>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Ajuda/Manual</span>
                                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-700 dark:text-slate-300">F1</kbd>
                            </div>
                        </div>
                    </div>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-4">Edição e Formulários:</strong>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Salvar</span>
                                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-700 dark:text-slate-300">Ctrl + S</kbd>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Cancelar/Voltar</span>
                                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-700 dark:text-slate-300">Esc</kbd>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Novo item</span>
                                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-700 dark:text-slate-300">Ctrl + N</kbd>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Duplicar</span>
                                <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-xs text-slate-700 dark:text-slate-300">Ctrl + D</kbd>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "features",
            difficulty: "intermediate",
            estimatedTime: "10 min",
            lastUpdated: "2024-01-15",
            tags: ["atalhos", "produtividade", "teclado", "navegação"],
            hasDownload: true
        }
    ];

    const difficulties = [
        { id: 'beginner', name: 'Iniciante', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
        { id: 'intermediate', name: 'Intermediário', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
        { id: 'advanced', name: 'Avançado', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' }
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

    const filteredItems = manualSections.filter(item => {
        const matchesSearch = searchTerm === "" ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (typeof item.content === "string"
                ? item.content.toLowerCase().includes(searchTerm.toLowerCase())
                : (typeof item.content === "object" && item.content !== null
                    ? (JSON.stringify(item.content).toLowerCase().includes(searchTerm.toLowerCase()))
                    : false
                )
            ) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === null || item.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === null || item.difficulty === selectedDifficulty;

        return matchesSearch && matchesCategory && matchesDifficulty;
    });

    const getCategoryCount = (categoryId: string) => {
        return manualSections.filter(item => item.category === categoryId).length;
    };

    const handleEmailSupport = () => {
        const email = config.email || '';
        const subject = `Dúvida sobre Manual - ${config.app_name}`;
        const body = `Olá equipe de suporte do ${config.app_name},\n\nTenho uma dúvida sobre o manual do usuário:\n\n[Descreva sua dúvida aqui]\n\nAguardo retorno.\n\nObrigado!`;

        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        return url;
    };

    const getDifficultyInfo = (difficulty: string) => {
        return difficulties.find(d => d.id === difficulty) || difficulties[0];
    };

    return (
        <>
            <Head title="Manual do Usuário" />
            <Quest2Layout
                title="Manual do Usuário"
                subtitle={`Guia completo para dominar todas as funcionalidades do ${config.app_name}. Do básico ao avançado, tudo que você precisa saber.`}
                icon={<BookOpen className="w-10 h-10 text-white" />}
            >
                {/* Estatísticas */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-slate-400 mb-12">
                    <span className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="hidden sm:inline">{manualSections.length} guias disponíveis</span>
                        <span className="sm:hidden">{manualSections.length} guias</span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="hidden sm:inline">{categories.length} categorias</span>
                        <span className="sm:hidden">{categories.length} cats</span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="hidden sm:inline">Com vídeos e downloads</span>
                        <span className="sm:hidden">Vídeos</span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="hidden sm:inline">Todos os níveis</span>
                        <span className="sm:hidden">Níveis</span>
                    </span>
                </div>

                {/* Alert Box */}
                <div className="mb-12">
                    <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                        Manual Interativo e Sempre Atualizado
                                    </h3>
                                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                                        Este manual é atualizado constantemente com novas funcionalidades e melhorias.
                                        Inclui <strong>tutoriais em vídeo</strong>, <strong>downloads úteis</strong> e guias passo-a-passo para todos os níveis de experiência.
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
                            placeholder="Pesquisar tutoriais..."
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

                    {/* Difficulty Filter */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Filtrar por nível:</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedDifficulty(null)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                    selectedDifficulty === null
                                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                )}
                            >
                                <span className="hidden sm:inline">Todos os níveis</span>
                                <span className="sm:hidden">Todos</span>
                            </button>
                            {difficulties.map((difficulty) => (
                                <button
                                    key={difficulty.id}
                                    onClick={() => setSelectedDifficulty(
                                        selectedDifficulty === difficulty.id ? null : difficulty.id
                                    )}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                        selectedDifficulty === difficulty.id
                                            ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    )}
                                >
                                    {difficulty.name}
                                </button>
                            ))}
                        </div>
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
                                                    {count} {count === 1 ? 'guia' : 'guias'}
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
                {(searchTerm || selectedCategory || selectedDifficulty) && (
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 gap-3 sm:gap-0">
                            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                                <span className="font-semibold">
                                    {filteredItems.length} {filteredItems.length === 1 ? 'guia encontrado' : 'guias encontrados'}
                                </span>
                                {selectedCategory && (
                                    <span className="ml-2 block sm:inline">
                                        na categoria <strong>"{categories.find(c => c.id === selectedCategory)?.name}"</strong>
                                    </span>
                                )}
                                {selectedDifficulty && (
                                    <span className="ml-2 block sm:inline">
                                        nível <strong>"{getDifficultyInfo(selectedDifficulty).name}"</strong>
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
                                    setSelectedDifficulty(null);
                                }}
                                className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 w-full sm:w-auto"
                            >
                                Limpar filtros
                            </Button>
                        </div>
                    </div>
                )}

                {/* Manual Sections */}
                <div className="space-y-3">
                    {filteredItems.length === 0 ? (
                        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <CardContent className="p-8 sm:p-12 text-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                                    Nenhum guia encontrado
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                                    Não encontramos guias que correspondam à sua pesquisa.
                                    Tente usar termos diferentes ou entre em contato conosco.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setSelectedCategory(null);
                                            setSelectedDifficulty(null);
                                        }}
                                        className="w-full sm:w-auto"
                                    >
                                        Limpar pesquisa
                                    </Button>
                                    <Button asChild className="w-full sm:w-auto">
                                        <a href={handleEmailSupport()}>
                                            <Mail className="w-4 h-4 mr-2" />
                                            Sugerir tutorial
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredItems.map((item, index) => {
                            const isOpen = openItems.has(item.id);
                            const category = categories.find(c => c.id === item.category);
                            const difficultyInfo = getDifficultyInfo(item.difficulty);

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
                                                    <Badge className={cn("text-xs", difficultyInfo.color)}>
                                                        <span className="hidden sm:inline">{difficultyInfo.name}</span>
                                                        <span className="sm:hidden">{difficultyInfo.name.substring(0, 3)}</span>
                                                    </Badge>
                                                    {item.estimatedTime && (
                                                        <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {item.estimatedTime}
                                                        </Badge>
                                                    )}
                                                    {item.hasVideo && (
                                                        <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                                            <Video className="w-3 h-3 mr-1" />
                                                            <span className="hidden sm:inline">Vídeo</span>
                                                        </Badge>
                                                    )}
                                                    {item.hasDownload && (
                                                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 hidden sm:inline-flex">
                                                            <Download className="w-3 h-3 mr-1" />
                                                            Download
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
                                                    {/* Action buttons */}
                                                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                                                        {item.hasVideo && (
                                                            <Button size="sm" variant="outline" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs sm:text-sm">
                                                                <Video className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                                                <span className="hidden sm:inline">Assistir vídeo</span>
                                                                <span className="sm:hidden">Vídeo</span>
                                                            </Button>
                                                        )}
                                                        {item.hasDownload && (
                                                            <Button size="sm" variant="outline" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 text-xs sm:text-sm">
                                                                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                                                                <span className="hidden sm:inline">Baixar recursos</span>
                                                                <span className="sm:hidden">Download</span>
                                                            </Button>
                                                        )}
                                                    </div>

                                                    <div className="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base">
                                                        <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                            {item.content}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
                                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-2">
                                                            Tags:
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

                                                    {item.lastUpdated && (
                                                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                <Calendar className="w-3 h-3 inline mr-1" />
                                                                Última atualização: {new Date(item.lastUpdated).toLocaleDateString('pt-BR')}
                                                            </p>
                                                        </div>
                                                    )}
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
                                    <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">
                                    Precisa de Ajuda Adicional?
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg">
                                    Não encontrou o que procurava? Nossa equipe está pronta para criar novos tutoriais
                                    ou esclarecer qualquer dúvida sobre o <strong>{config.app_name}</strong>.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" asChild className="w-full sm:w-auto">
                                        <a href={handleEmailSupport()}>
                                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Solicitar tutorial
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
                                    Criamos novos tutoriais baseados no feedback dos usuários
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Quest2Layout>

            <style>{`
                .prose div {
                    margin-bottom: 1rem;
                }
                .prose strong {
                    font-weight: 600;
                }
                .prose kbd {
                    background-color: #f1f5f9;
                    border: 1px solid #cbd5e1;
                    border-radius: 4px;
                    padding: 2px 6px;
                    font-family: monospace;
                    font-size: 0.875rem;
                }
                .dark .prose kbd {
                    background-color: #374151;
                    border-color: #4b5563;
                    color: #e5e7eb;
                }
            `}</style>
        </>
    );
}
