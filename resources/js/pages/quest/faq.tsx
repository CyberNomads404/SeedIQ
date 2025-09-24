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
    HelpCircle,
    MessageCircle,
    Shield,
    CreditCard,
    Settings,
    Users,
    Mail,
    ArrowLeft
} from "lucide-react";
import config from "@/constants/config";
import Quest2Layout from "@/layouts/quest-2-layout";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    tags: string[];
}

interface FAQCategory {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
}

export default function FAQ() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const categories: FAQCategory[] = [
        { id: "general", name: "Geral", icon: HelpCircle, color: "bg-blue-500" },
        { id: "account", name: "Conta", icon: Users, color: "bg-green-500" },
        { id: "security", name: "Segurança", icon: Shield, color: "bg-red-500" },
        { id: "billing", name: "Cobrança", icon: CreditCard, color: "bg-purple-500" },
        { id: "technical", name: "Técnico", icon: Settings, color: "bg-orange-500" },
        { id: "support", name: "Suporte", icon: MessageCircle, color: "bg-teal-500" },
    ];

    const faqItems: FAQItem[] = [
        {
            id: "1",
            question: "Como criar uma conta?",
            answer: "Para criar uma conta, clique no botão 'Registrar' no canto superior direito da página inicial. Preencha suas informações pessoais, escolha uma senha segura e confirme seu e-mail. Você receberá um e-mail de verificação para ativar sua conta.",
            category: "account",
            tags: ["registro", "conta", "email"]
        },
        {
            id: "2",
            question: "Como alterar minha senha?",
            answer: "Acesse 'Configurações' > 'Segurança' > 'Alterar Senha'. Digite sua senha atual, em seguida sua nova senha duas vezes para confirmação. Clique em 'Salvar alterações'. Recomendamos usar senhas com pelo menos 8 caracteres, incluindo letras, números e símbolos.",
            category: "security",
            tags: ["senha", "segurança", "alteração"]
        },
        {
            id: "3",
            question: "Quais são os métodos de pagamento aceitos?",
            answer: "Aceitamos cartões de crédito (Visa, Mastercard, American Express), cartões de débito, PIX, boleto bancário e transferência bancária. Todos os pagamentos são processados de forma segura através de nossos parceiros certificados.",
            category: "billing",
            tags: ["pagamento", "cartão", "pix", "boleto"]
        },
        {
            id: "4",
            question: "Como verificar meu e-mail?",
            answer: `Após criar sua conta, você receberá um e-mail de verificação. Clique no link fornecido no e-mail. Se não recebeu o e-mail, verifique sua pasta de spam ou acesse nossa <a href="#" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline font-medium">página de verificação de e-mail</a> para solicitar um novo link.`,
            category: "account",
            tags: ["email", "verificação", "spam"]
        },
        {
            id: "5",
            question: "O sistema está seguro?",
            answer: "Sim! Utilizamos criptografia SSL/TLS para todas as comunicações, autenticação em duas etapas, monitoramento 24/7 e seguimos as melhores práticas de segurança da indústria. Seus dados são protegidos por múltiplas camadas de segurança.",
            category: "security",
            tags: ["segurança", "ssl", "criptografia", "2fa"]
        },
        {
            id: "6",
            question: "Como entrar em contato com o suporte?",
            answer: "Você pode entrar em contato conosco através do chat ao vivo (disponível 24/7), e-mail (suporte@exemplo.com), ou telefone (0800-123-4567). Também temos uma central de ajuda completa com tutoriais e guias.",
            category: "support",
            tags: ["suporte", "contato", "chat", "telefone"]
        },
        {
            id: "7",
            question: "Como cancelar minha conta?",
            answer: "Para cancelar sua conta, acesse 'Configurações' > 'Conta' > 'Cancelar Conta'. Você precisará confirmar sua senha e o motivo do cancelamento. Todos os seus dados serão removidos permanentemente após 30 dias. Durante este período, você pode reativar sua conta a qualquer momento.",
            category: "account",
            tags: ["cancelamento", "exclusão", "dados"]
        },
        {
            id: "8",
            question: "Posso exportar meus dados?",
            answer: "Sim! Você pode exportar todos os seus dados a qualquer momento. Acesse 'Configurações' > 'Privacidade' > 'Exportar Dados'. Será gerado um arquivo JSON com todas as suas informações que será enviado para seu e-mail em até 24 horas.",
            category: "general",
            tags: ["exportar", "dados", "privacidade", "lgpd"]
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

    const filteredItems = faqItems.filter(item => {
        const matchesSearch = searchTerm === "" ||
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === null || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const getCategoryCount = (categoryId: string) => {
        return faqItems.filter(item => item.category === categoryId).length;
    };

    const handleEmailSupport = () => {
        const email = config.email || '';
        const subject = `Suporte - FAQ do ${config.app_name}`;
        const faq = searchTerm || '[Descreva sua dúvida aqui]';
        const body = `Olá equipe de suporte do ${config.app_name},\n\nEstou com uma dúvida que não encontrei na FAQ:\n\n${faq}\n\nAguardo retorno.\n\nObrigado!`;

        const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        return url;
    };

    return (
        <>
            <Head title="Perguntas Frequentes" />
            <Quest2Layout
                title="Perguntas Frequentes"
                subtitle={`Encontre respostas rápidas para as dúvidas mais comuns sobre o ${config.app_name}. Se não encontrar o que procura, nossa equipe está pronta para ajudar.`}
                icon={<HelpCircle className="w-10 h-10 text-white" />}
            >
                {/* Estatísticas */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm text-slate-500 dark:text-slate-400 mb-12">
                    <span className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="hidden sm:inline">{faqItems.length} perguntas disponíveis</span>
                        <span className="sm:hidden">{faqItems.length} perguntas</span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="hidden sm:inline">{categories.length} categorias</span>
                        <span className="sm:hidden">{categories.length} cats</span>
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="hidden sm:inline">Atualizado hoje</span>
                        <span className="sm:hidden">Atual</span>
                    </span>
                </div>

                {/* Alert Box */}
                <div className="mb-12">
                    <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                        Central de Ajuda Completa
                                    </h3>
                                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                                        Nossa FAQ é constantemente atualizada com as perguntas mais frequentes.
                                        Use a busca para encontrar rapidamente o que precisa ou <strong>navegue pelas categorias</strong> organizadas.
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
                            placeholder="Pesquisar perguntas, respostas ou palavras-chave..."
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
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
                                    <CardContent className="p-3 sm:p-4 text-center">
                                        <div className={cn(
                                            "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-transform duration-200",
                                            category.color,
                                            isSelected && "scale-110"
                                        )}>
                                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                        </div>
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-1">
                                            {category.name}
                                        </h3>
                                        <Badge
                                            variant={isSelected ? "default" : "secondary"}
                                            className="text-xs"
                                        >
                                            {count} {count === 1 ? 'pergunta' : 'perguntas'}
                                        </Badge>
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
                                    {filteredItems.length} {filteredItems.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
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

                {/* FAQ Items */}
                <div className="space-y-3">
                    {filteredItems.length === 0 ? (
                        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                            <CardContent className="p-8 sm:p-12 text-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                                    Nenhum resultado encontrado
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
                                    Não encontramos perguntas que correspondam à sua pesquisa.
                                    Tente usar palavras-chave diferentes ou entre em contato conosco.
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
                                        <a href={handleEmailSupport()}>
                                            <Mail className="w-4 h-4 mr-2" />
                                            Entrar em contato
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
                                                        <span className="sm:hidden">{category?.name}</span>
                                                    </Badge>
                                                </div>
                                                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors pr-2">
                                                    {item.question}
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
                                                        <p
                                                            className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base"
                                                            dangerouslySetInnerHTML={{ __html: item.answer }}
                                                        />
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
                                    <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">
                                    Não encontrou sua resposta?
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-base sm:text-lg">
                                    Nossa equipe de suporte especializada está pronta para ajudar você com qualquer dúvida sobre o <strong>{config.app_name}</strong>.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button size="lg" asChild className="w-full sm:w-auto">
                                        <a href={handleEmailSupport()}>
                                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                            Enviar e-mail para suporte
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
                                    Respondemos normalmente em até 24 horas
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Quest2Layout>

            <style>{`
                .prose p {
                    margin-bottom: 0;
                }
                .prose a {
                    color: rgb(37 99 235);
                    text-decoration: underline;
                    font-weight: 500;
                }
                .dark .prose a {
                    color: rgb(96 165 250);
                }
                .prose a:hover {
                    color: rgb(29 78 216);
                }
                .dark .prose a:hover {
                    color: rgb(147 197 253);
                }
            `}</style>
        </>
    );
}
