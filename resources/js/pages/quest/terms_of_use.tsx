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
    FileText,
    Scale,
    User,
    Shield,
    AlertTriangle,
    Gavel,
    Mail,
    ArrowLeft,
    Calendar,
    CheckCircle,
    XCircle
} from "lucide-react";
import config from "@/constants/config";
import Quest2Layout from "@/layouts/quest-2-layout";

interface TermsSection {
    id: string;
    title: string;
    content: React.ReactNode; // Mudei de string para ReactNode
    category: string;
    importance: 'high' | 'medium' | 'low';
    lastUpdated?: string;
    tags: string[];
}

interface TermsCategory {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
    description: string;
}

export default function TermsOfUse() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedImportance, setSelectedImportance] = useState<string | null>(null);
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const categories: TermsCategory[] = [
        {
            id: "account",
            name: "Conta e Acesso",
            icon: User,
            color: "bg-blue-500",
            description: "Criação e uso da conta"
        },
        {
            id: "usage",
            name: "Uso do Serviço",
            icon: CheckCircle,
            color: "bg-green-500",
            description: "Como usar nossa plataforma"
        },
        {
            id: "prohibited",
            name: "Condutas Proibidas",
            icon: XCircle,
            color: "bg-red-500",
            description: "O que não é permitido"
        },
        {
            id: "liability",
            name: "Responsabilidades",
            icon: Scale,
            color: "bg-purple-500",
            description: "Limitações e responsabilidades"
        },
        {
            id: "termination",
            name: "Cancelamento",
            icon: AlertTriangle,
            color: "bg-orange-500",
            description: "Encerramento do serviço"
        },
        {
            id: "legal",
            name: "Aspectos Legais",
            icon: Gavel,
            color: "bg-teal-500",
            description: "Lei aplicável e jurisdição"
        }
    ];

    const termsSection: TermsSection[] = [
        {
            id: "1",
            title: "Aceitação dos Termos",
            content: (
                <div>
                    <p className="mb-4">Ao acessar e utilizar o {config.app_name}, você concorda em estar vinculado a estes Termos de Uso.</p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">💼</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Concordância:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">O uso continuado de nossos serviços constitui aceitação destes termos.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">📝</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Alterações:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs">🔔</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Notificação:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Mudanças significativas nos termos serão comunicadas através de e-mail ou notificação na plataforma.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs">18+</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Idade Mínima:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Você deve ter pelo menos 18 anos para usar nossos serviços ou ter autorização dos pais/responsáveis.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "account",
            importance: "high",
            lastUpdated: "2024-01-15",
            tags: ["aceitação", "concordância", "idade mínima", "alterações"]
        },
        {
            id: "2",
            title: "Criação e Uso da Conta",
            content: (
                <div>
                    <p className="mb-4">Para utilizar nossos serviços, você deve criar uma conta fornecendo informações precisas.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">✅ Informações Verdadeiras</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Você é responsável por fornecer informações precisas, atuais e completas.</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">🔒 Segurança da Conta</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorram em sua conta.</p>
                        </div>
                    </div>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-3">Regras importantes:</strong>

                    <ul className="list-disc list-inside space-y-2 my-4 text-slate-700 dark:text-slate-300">
                        <li><strong className="text-slate-900 dark:text-slate-100">Uso Pessoal:</strong> Sua conta é para uso pessoal e não pode ser compartilhada, vendida ou transferida para terceiros.</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Notificação de Uso Indevido:</strong> Você deve nos notificar imediatamente sobre qualquer uso não autorizado de sua conta.</li>
                        <li><strong className="text-slate-900 dark:text-slate-100">Uma Conta por Pessoa:</strong> Cada usuário pode ter apenas uma conta ativa. Contas múltiplas podem resultar em suspensão.</li>
                    </ul>
                </div>
            ),
            category: "account",
            importance: "high",
            lastUpdated: "2024-01-15",
            tags: ["conta", "registro", "segurança", "senha", "responsabilidade"]
        },
        {
            id: "3",
            title: "Uso Aceitável dos Serviços",
            content: (
                <div>
                    <p className="mb-4">O {config.app_name} deve ser usado de forma legal, ética e de acordo com estes termos.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">✅ Permitido</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Uso para fins legais</li>
                                <li>• Respeitar funcionalidades</li>
                                <li>• Dados precisos</li>
                            </ul>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">❌ Não Permitido</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Interferência no sistema</li>
                                <li>• Violação de propriedade intelectual</li>
                                <li>• Contornar limitações técnicas</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs">💡</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Lembre-se:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Use os recursos conforme projetado e mantenha sempre suas informações atualizadas.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "usage",
            importance: "medium",
            lastUpdated: "2024-01-15",
            tags: ["uso aceitável", "finalidade", "propriedade intelectual", "dados"]
        },
        {
            id: "4",
            title: "Condutas Proibidas",
            content: (
                <div>
                    <p className="mb-4">As seguintes atividades são estritamente proibidas em nossa plataforma:</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3">🚫 Atividades Criminosas</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Atividades ilegais</li>
                                <li>• Fraudes</li>
                                <li>• Violação de leis</li>
                            </ul>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">⚡ Ataques Técnicos</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Tentativas de hacking</li>
                                <li>• Sobrecarga do sistema</li>
                                <li>• Comprometer segurança</li>
                            </ul>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">📱 Spam e Automação</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Envio de spam</li>
                                <li>• Uso de bots</li>
                                <li>• Automação não autorizada</li>
                            </ul>
                        </div>
                        <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4">
                            <h4 className="font-semibold text-pink-900 dark:text-pink-100 mb-3">🔒 Violação de Privacidade</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Coleta não autorizada de dados</li>
                                <li>• Violação de privacidade</li>
                                <li>• Manipulação de métricas</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <AlertTriangle className="w-3 h-3 text-white" />
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Consequências:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Violações podem resultar em suspensão imediata da conta e ações legais cabíveis.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "prohibited",
            importance: "high",
            lastUpdated: "2024-01-15",
            tags: ["proibições", "atividades ilegais", "spam", "segurança", "conteúdo"]
        },
        {
            id: "5",
            title: "Propriedade Intelectual",
            content: (
                <div>
                    <p className="mb-4">Todos os direitos de propriedade intelectual do {config.app_name} são protegidos.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">🏢 Nossa Propriedade</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Software e código</li>
                                <li>• Design e interface</li>
                                <li>• Logotipos e marcas</li>
                                <li>• Textos e conteúdo</li>
                            </ul>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">👤 Seus Dados</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Você mantém a propriedade</li>
                                <li>• Licença para processamento</li>
                                <li>• Conforme Política de Privacidade</li>
                                <li>• Feedback pode ser usado</li>
                            </ul>
                        </div>
                    </div>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-3">Licença de Uso:</strong>
                    <p className="text-slate-700 dark:text-slate-300 mb-4">
                        Concedemos uma licença <strong>limitada, não exclusiva e revogável</strong> para usar nossos serviços.
                        Você não pode copiar, modificar, distribuir ou criar obras derivadas sem autorização.
                    </p>
                </div>
            ),
            category: "legal",
            importance: "medium",
            lastUpdated: "2024-01-15",
            tags: ["propriedade intelectual", "licença", "direitos autorais", "dados"]
        },
        {
            id: "6",
            title: "Limitação de Responsabilidade",
            content: (
                <div>
                    <p className="mb-4">Limitamos nossa responsabilidade nos termos permitidos por lei.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">⚠️ "Como Está"</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Fornecemos nossos serviços "como estão", sem garantias expressas ou implícitas.</p>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">📊 Disponibilidade</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Não garantimos que o serviço estará disponível 24/7 ou livre de interrupções.</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">💰 Limitação de Danos</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Nossa responsabilidade é limitada ao valor pago nos últimos 12 meses.</p>
                        </div>
                    </div>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-3">Exclusões de Responsabilidade:</strong>
                    <ul className="list-disc list-inside space-y-1 my-4 text-slate-700 dark:text-slate-300">
                        <li>Perda de dados ou informações</li>
                        <li>Lucros cessantes ou oportunidades perdidas</li>
                        <li>Danos consequenciais ou indiretos</li>
                        <li>Falhas por eventos fora de nosso controle (força maior)</li>
                    </ul>
                </div>
            ),
            category: "liability",
            importance: "high",
            lastUpdated: "2024-01-15",
            tags: ["responsabilidade", "garantias", "danos", "limitações"]
        },
        {
            id: "7",
            title: "Pagamentos e Cobrança",
            content: (
                <div>
                    <p className="mb-4">Termos relacionados a pagamentos e cobrança de nossos serviços.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">💳 Política de Preços</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Sujeitos a alterações</li>
                                <li>• Notificação prévia de 30 dias</li>
                                <li>• Cobrados antecipadamente</li>
                            </ul>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">📋 Responsabilidades</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Você paga todos os impostos</li>
                                <li>• Manter pagamentos em dia</li>
                                <li>• Sem reembolso proporcional</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs">⚠️</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Pagamentos em Atraso:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Serviços podem ser suspensos por falta de pagamento após notificação prévia.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "usage",
            importance: "medium",
            lastUpdated: "2024-01-15",
            tags: ["pagamentos", "cobrança", "preços", "impostos", "reembolso"]
        },
        {
            id: "8",
            title: "Suspensão e Cancelamento",
            content: (
                <div>
                    <p className="mb-4">Condições sob as quais podemos suspender ou cancelar contas.</p>

                    <strong className="text-slate-900 dark:text-slate-100 block mb-4">Motivos para Suspensão:</strong>

                    <div className="space-y-4 my-6">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">1</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Violação dos Termos</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Podemos suspender ou cancelar contas que violem estes termos de uso.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">2</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Atividade Suspeita</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Contas envolvidas em atividades suspeitas ou fraudulentas podem ser suspendidas.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">3</div>
                            <div>
                                <p className="text-slate-900 dark:text-slate-100"><strong>Investigações de Segurança</strong></p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Podemos suspender contas temporariamente durante investigações.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📧 Cancelamento Voluntário</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Você pode cancelar sua conta a qualquer momento através das configurações.
                            Após o cancelamento, seus dados serão removidos conforme nossa Política de Privacidade.
                        </p>
                    </div>
                </div>
            ),
            category: "termination",
            importance: "high",
            lastUpdated: "2024-01-15",
            tags: ["suspensão", "cancelamento", "violação", "investigação"]
        },
        {
            id: "9",
            title: "Modificações dos Serviços",
            content: (
                <div>
                    <p className="mb-4">Reservamo-nos o direito de modificar ou descontinuar nossos serviços.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">✨ Melhorias</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Podemos adicionar, modificar ou remover funcionalidades para melhorar nossos serviços.
                            </p>
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">✅ Sempre visando melhor experiência</div>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">📋 Descontinuação</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Podemos descontinuar recursos ou serviços mediante notificação prévia.
                            </p>
                            <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">⚠️ Com ferramentas de migração</div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs">💡</span>
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Importante:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    Modificações ou descontinuações não geram direito a compensação.
                                    Em caso de descontinuação, forneceremos ferramentas para exportar seus dados.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "usage",
            importance: "medium",
            lastUpdated: "2024-01-15",
            tags: ["modificações", "melhorias", "descontinuação", "migração"]
        },
        {
            id: "10",
            title: "Lei Aplicável e Jurisdição",
            content: (
                <div>
                    <p className="mb-4">Aspectos legais e jurisdição aplicáveis a estes termos.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">🇧🇷 Lei Brasileira</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Regidos pelas leis do Brasil</li>
                                <li>• Tribunais competentes brasileiros</li>
                                <li>• Versão em português prevalece</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">🤝 Resolução de Disputas</h4>
                            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <li>• Mediação amigável preferível</li>
                                <li>• Antes de recurso judicial</li>
                                <li>• Salvaguarda das cláusulas válidas</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 my-4">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Scale className="w-3 h-3 text-white" />
                            </div>
                            <div>
                                <strong className="text-slate-900 dark:text-slate-100">Salvaguarda:</strong>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    Se alguma cláusula for considerada inválida, as demais permanecerão em vigor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            category: "legal",
            importance: "medium",
            lastUpdated: "2024-01-15",
            tags: ["lei aplicável", "jurisdição", "brasil", "disputas", "mediação"]
        }
    ];

    const importance = [
        { id: 'high', name: 'Alta Importância', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
        { id: 'medium', name: 'Média Importância', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
        { id: 'low', name: 'Baixa Importância', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' }
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

    const filteredItems = termsSection.filter(item => {
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
        const matchesImportance = selectedImportance === null || item.importance === selectedImportance;

        return matchesSearch && matchesCategory && matchesImportance;
    });

    const getCategoryCount = (categoryId: string) => {
        return termsSection.filter(item => item.category === categoryId).length;
    };

    const handleEmailSupport = () => {
        const email = config.email || '';
        const subject = `Dúvida sobre Termos de Uso - ${config.app_name}`;
        const body = `Olá equipe jurídica do ${config.app_name},\n\nTenho uma dúvida sobre os termos de uso:\n\n[Descreva sua dúvida aqui]\n\nAguardo retorno.\n\nObrigado!`;

        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        return url;
    };

    const getImportanceInfo = (importanceLevel: string) => {
        return importance.find(i => i.id === importanceLevel) || importance[1];
    };

    return (
        <>
            <Head title="Termos de Uso" />
            <Quest2Layout
                title="Termos de Uso"
                subtitle={`Conheça os termos e condições para uso do ${config.app_name}. Leia com atenção para entender seus direitos e responsabilidades.`}
                icon={<FileText className="w-10 h-10 text-white" />}
            >
                {/* Estatísticas */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-slate-400 mb-12">
                    <span className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="hidden sm:inline">{termsSection.length} seções detalhadas</span>
                        <span className="sm:hidden">{termsSection.length} seções</span>
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
                        <span className="hidden sm:inline">Lei brasileira</span>
                        <span className="sm:hidden">Lei BR</span>
                    </span>
                </div>

                {/* Alert Box */}
                <div className="mb-12">
                    <Card className="border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-slate-800 dark:to-slate-700">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                        Leia com Atenção
                                    </h3>
                                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                                        Estes termos constituem um <strong>acordo legal vinculativo</strong> entre você e o {config.app_name}.
                                        Ao usar nossos serviços, você concorda em cumprir todas as condições aqui estabelecidas.
                                        Em caso de dúvidas, entre em contato conosco antes de prosseguir.
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
                            placeholder="Pesquisar termos, cláusulas ou palavras específicas..."
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

                    {/* Importance Filter */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Filtrar por importância:</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedImportance(null)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                    selectedImportance === null
                                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                )}
                            >
                                <span className="hidden sm:inline">Todas as importâncias</span>
                                <span className="sm:hidden">Todas</span>
                            </button>
                            {importance.map((imp) => (
                                <button
                                    key={imp.id}
                                    onClick={() => setSelectedImportance(
                                        selectedImportance === imp.id ? null : imp.id
                                    )}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                        selectedImportance === imp.id
                                            ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    )}
                                >
                                    <span className="hidden sm:inline">{imp.name}</span>
                                    <span className="sm:hidden">{imp.name.split(' ')[0]}</span>
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
                {(searchTerm || selectedCategory || selectedImportance) && (
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
                                {selectedImportance && (
                                    <span className="ml-2 block sm:inline">
                                        com <strong>"{getImportanceInfo(selectedImportance).name}"</strong>
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
                                    setSelectedImportance(null);
                                }}
                                className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 w-full sm:w-auto"
                            >
                                Limpar filtros
                            </Button>
                        </div>
                    </div>
                )}

                {/* Terms Sections */}
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
                                            setSelectedImportance(null);
                                        }}
                                        className="w-full sm:w-auto"
                                    >
                                        Limpar pesquisa
                                    </Button>
                                    <Button asChild className="w-full sm:w-auto">
                                        <a href={handleEmailSupport()}>
                                            <Mail className="w-4 h-4 mr-2" />
                                            Dúvidas jurídicas
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredItems.map((item, index) => {
                            const isOpen = openItems.has(item.id);
                            const category = categories.find(c => c.id === item.category);
                            const importanceInfo = getImportanceInfo(item.importance);

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
                                                    <Badge className={cn("text-xs", importanceInfo.color)}>
                                                        <span className="hidden sm:inline">{importanceInfo.name}</span>
                                                        <span className="sm:hidden">{importanceInfo.name.split(' ')[0]}</span>
                                                    </Badge>
                                                    {item.lastUpdated && (
                                                        <Badge variant="secondary" className="text-xs inline-flex"> {/* Removido hidden sm:inline-flex */}
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

                {/* Legal Notice */}
                <div className="mt-16 sm:mt-20">
                    <Card className="border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                        Aviso Legal
                                    </h3>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                                        <strong>Data de Vigência:</strong> Janeiro de 2024<br/>
                                        <strong>Última Atualização:</strong> 15 de Janeiro de 2024<br/>
                                        <strong>Lei Aplicável:</strong> República Federativa do Brasil<br/>
                                        <strong>Contato Jurídico:</strong> <a href={`mailto:${config.email}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline">{config.email}</a>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Section */}
                <div className="mt-12 sm:mt-16">
                    <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
                        <CardContent className="p-6 sm:p-8 text-center relative">
                            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200 dark:bg-blue-900/30 rounded-full -translate-y-12 translate-x-12 sm:-translate-y-16 sm:translate-x-16 opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-18 h-18 sm:w-24 sm:h-24 bg-blue-300 dark:bg-blue-800/30 rounded-full translate-y-9 -translate-x-9 sm:translate-y-12 sm:-translate-x-12 opacity-30"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                                    <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">
                                    Dúvidas sobre os Termos?
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg">
                                    Se você tem dúvidas sobre estes termos de uso ou precisa de esclarecimentos jurídicos,
                                    nossa equipe está pronta para ajudar.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" asChild className="w-full sm:w-auto">
                                        <a href={handleEmailSupport()}>
                                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Contato jurídico
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
                                    Respondemos questões jurídicas em até 5 dias úteis
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
