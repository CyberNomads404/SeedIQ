import React, { useMemo } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    ChevronLeft,
    Clock,
    Image as ImageIcon,
    Tag,
    Slash,
    BarChart3,
    Zap,
    Leaf,
    Sparkles,
    CircleX,
    Mail,
    NutOffIcon,
    Shrink,
    Flame,
    AlertCircle,
    HelpCircle
} from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IClassification } from "@/interfaces/IClassification";

const route = (window as any).route;

interface IClassificationShowProps {
    classification: IClassification;
}

const STATUS_CLASS_MAP: Record<string, string> = {
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
    registered: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    in_progress: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    failed: "bg-red-100 text-red-800 hover:bg-red-200",
    canceled: "bg-gray-200 text-gray-800",
};

const normalizeStatus = (status?: string): string => {
    if (!status) return "registered";
    return status === "processing" ? "in_progress" : status;
};

const formatDate = (value?: string | null): string => {
    if (!value) return "—";
    try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : date.toLocaleString();
    } catch {
        return value;
    }
};

const StatusBadge = ({ status, label }: { status?: string; label?: string }) => {
    const normalizedStatus = normalizeStatus(status);
    const className = STATUS_CLASS_MAP[normalizedStatus] ?? "bg-gray-100 text-gray-800";

    return (
        <Badge variant="secondary" className={className}>
            {label ?? status ?? normalizedStatus}
        </Badge>
    );
};

const InfoSection = ({
    title,
    children,
    icon,
}: {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
}) => (
    <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        <div>{children}</div>
    </div>
);

const StatCard = ({
    title,
    value,
    percentage,
    icon: Icon,
    colorScheme,
}: {
    title: string;
    value: number;
    percentage: string;
    icon: React.ElementType;
    colorScheme: "red" | "yellow" | "green" | "lime" | "gray" | "amber";
}) => {
    const colors = {
        red: {
            border: "border-red-200",
            bg: "bg-red-50/50",
            iconBg: "bg-red-100",
            icon: "text-red-600",
            label: "text-red-700",
            value: "text-red-800",
            percentage: "text-red-600",
        },
        yellow: {
            border: "border-yellow-200",
            bg: "bg-yellow-50/50",
            iconBg: "bg-yellow-100",
            icon: "text-yellow-600",
            label: "text-yellow-700",
            value: "text-yellow-800",
            percentage: "text-yellow-600",
        },
        green: {
            border: "border-green-200",
            bg: "bg-green-50/50",
            iconBg: "bg-green-100",
            icon: "text-green-600",
            label: "text-green-700",
            value: "text-green-800",
            percentage: "text-green-600",
        },
        lime: {
            border: "border-lime-200",
            bg: "bg-lime-50/50",
            iconBg: "bg-lime-100",
            icon: "text-lime-600",
            label: "text-lime-700",
            value: "text-lime-800",
            percentage: "text-lime-600",
        },
        gray: {
            border: "border-gray-200",
            bg: "bg-gray-50/50",
            iconBg: "bg-gray-100",
            icon: "text-gray-600",
            label: "text-gray-700",
            value: "text-gray-800",
            percentage: "text-gray-600",
        },
        amber: {
            border: "border-amber-200",
            bg: "bg-amber-50/50",
            iconBg: "bg-amber-100",
            icon: "text-amber-600",
            label: "text-amber-700",
            value: "text-amber-800",
            percentage: "text-amber-600",
        },
    };

    const color = colors[colorScheme];

    return (
        <Card className={`${color.border} ${color.bg}`}>
            <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                    <div className={`p-3 ${color.iconBg} rounded-full`}>
                        <Icon className={`w-6 h-6 ${color.icon}`} />
                    </div>
                    <div>
                        <p className={`text-sm font-medium ${color.label}`}>{title}</p>
                        <div className="flex items-baseline space-x-2">
                            <p className={`text-2xl font-bold ${color.value}`}>{value}</p>
                            <p className={`text-sm ${color.percentage}`}>({percentage}%)</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const ResultsCard = ({ classification }: { classification: IClassification }) => {
    const result = classification.result;
    if (!result) return null;

    const good = Number(
        result.good ?? result.good ?? result.payload?.data?.result?.good ?? 0
    );
    const bad_detection = Number(
        result.bad_detection ?? result.payload?.data?.result?.bad_detection ?? 0
    );
    const unknown = Number(
        result.unknown ?? result.payload?.data?.result?.unknown ?? 0
    );
    const burned = Number(
        result.burned ?? result.payload?.data?.result?.burned ?? 0
    );
    const greenish = Number(
        result.greenish ?? result.payload?.data?.result?.greenish ?? 0
    );
    const small = Number(
        result.small ?? result.payload?.data?.result?.small ?? 0
    );

    const totalGrains = good + bad_detection + unknown + burned + greenish + small;

    const getPercentage = (value?: number | null): string => {
        const v = Number(value ?? 0);
        return totalGrains === 0 ? "0.0" : ((v / totalGrains) * 100).toFixed(1);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <BarChart3 className="w-6 h-6 mr-2" />
                    Resultados da Análise
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="Grãos Bons"
                        value={good}
                        percentage={getPercentage(good)}
                        icon={Sparkles}
                        colorScheme="green"
                    />
                    <StatCard
                        title="Grãos Pequenos"
                        value={small}
                        percentage={getPercentage(small)}
                        icon={Shrink}
                        colorScheme="yellow"
                    />
                    <StatCard
                        title="Grãos Queimados"
                        value={burned}
                        percentage={getPercentage(burned)}
                        icon={Flame}
                        colorScheme="red"
                    />
                    <StatCard
                        title="Grãos Esverdeados"
                        value={greenish}
                        percentage={getPercentage(greenish)}
                        icon={Leaf}
                        colorScheme="lime"
                    />
                    <StatCard
                        title="Má Detecção"
                        value={bad_detection}
                        percentage={getPercentage(bad_detection)}
                        icon={AlertCircle}
                        colorScheme="amber"
                    />
                    <StatCard
                        title="Grãos Desconhecidos"
                        value={unknown}
                        percentage={getPercentage(unknown)}
                        icon={HelpCircle}
                        colorScheme="gray"
                    />
                </div>

                <div className="bg-muted/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Resumo da Análise</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-primary">{totalGrains}</p>
                            <p className="text-sm text-muted-foreground">Total de Grãos</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">{getPercentage(good)}%</p>
                            <p className="text-sm text-muted-foreground">Qualidade Boa</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-yellow-600">{getPercentage(small + greenish + burned)}%</p>
                            <p className="text-sm text-muted-foreground">Necessita Atenção</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600">{getPercentage(bad_detection + unknown)}%</p>
                            <p className="text-sm text-muted-foreground">Problemas</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        <details className="space-y-4">
                            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                                Ver informações técnicas
                            </summary>
                            <div className="bg-muted/30 p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">
                                    <strong>Resultado processado:</strong> {formatDate(result.created_at)}
                                </p>
                                <p className="text-sm text-muted-foreground mb-2">
                                    <strong>Última atualização:</strong> {formatDate(result.updated_at)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    <strong>ID do resultado:</strong> {result.external_id}
                                </p>
                            </div>
                        </details>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const EmptyState = ({
    status,
    onReanalyze,
    processing
}: {
    status: string;
    onReanalyze: () => void;
    processing: boolean;
}) => {
    const stateConfig = {
        failed: {
            title: "Falha no Processamento",
            description: "A análise desta imagem falhou. Você pode tentar reanalisar a imagem abaixo.",
            showRetry: true,
        },
        in_progress: {
            title: "Análise em Processamento",
            description: "Os resultados da análise ainda não estão disponíveis. Isso pode levar alguns minutos para ser processado.",
            showRetry: false,
        },
        canceled: {
            title: "Análise Cancelada",
            description: "Esta análise foi cancelada.",
            showRetry: false,
        },
        registered: {
            title: "Aguardando Processamento",
            description: "A análise foi registrada e está na fila para processamento.",
            showRetry: false,
        },
    };

    const config = stateConfig[status as keyof typeof stateConfig] ?? stateConfig.registered;

    return (
        <Card>
            <CardContent className="p-8 text-center">
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        {status === "failed" ? (
                            <CircleX className="w-8 h-8 text-muted-foreground" />
                        ) : (
                            <BarChart3 className="w-8 h-8 text-muted-foreground" />
                        )}
                    </div>

                    <h3 className="text-lg font-semibold">{config.title}</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">{config.description}</p>

                    {config.showRetry && (
                        <Button onClick={onReanalyze} disabled={processing}>
                            {processing ? "Reanalisando..." : "Reanalisar"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const UserCard = ({ user }: { user: any }) => {
    if (!user) return null;

    const initials = user.name
        ?.split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <Button
            variant="ghost"
            className="w-full py-12 px-6 bg-muted/50 hover:bg-muted/50 transition-colors"
            onClick={() => router.get(route("users.show", { uuid: user.external_id }))}
        >
            <div className="flex items-center gap-4 rounded-lg w-full">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-border">
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                            <span className="font-medium">{initials}</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center justify-between gap-3">
                        <h4 className="font-medium text-foreground text-sm truncate">{user.name}</h4>
                        <Badge className="text-xs" variant={user.active ? "secondary" : "outline"}>
                            {user.role_user ?? (user.active ? "Ativo" : "Inativo")}
                        </Badge>
                    </div>

                    <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2 truncate">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{user.email}</span>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground opacity-80">
                        Clique para ver mais detalhes
                    </p>
                </div>
            </div>
        </Button>
    );
};

export default function Show({ classification }: IClassificationShowProps) {
    const status = useMemo(() => normalizeStatus(classification.status), [classification.status]);
    const { processing, post } = useForm({});

    const handleReanalyze = () => {
        post(route("classifications.api.reanalyze", classification.external_id), {
            preserveScroll: true,
            onSuccess: () => {
                setTimeout(() => window.location.reload(), 900);
            },
        });
    };

    console.log(classification);

    return (
        <AuthenticatedLayout
            header={
                <Link
                    href={route("classifications.index")}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Voltar para Classificações
                </Link>
            }
        >
            <Head title="Detalhes da Classificação" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <CardTitle className="text-2xl font-bold">
                                        Resultado da Classificação
                                    </CardTitle>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="w-4 h-4 mr-1" />
                                        Criado em {formatDate(classification.created_at_human ?? classification.created_at)}
                                    </div>
                                </div>
                                <StatusBadge
                                    status={classification.status}
                                    label={classification.status_label}
                                />
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <InfoSection
                                    title="Imagem Analisada"
                                    icon={<ImageIcon className="w-5 h-5" />}
                                >
                                    <div className="aspect-square rounded-xl overflow-hidden bg-muted border">
                                        {classification.file_url ? (
                                            <img
                                                src={classification.file_url}
                                                alt="Imagem da classificação"
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <div className="text-center">
                                                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                                                    <p>Imagem não disponível</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </InfoSection>

                                <div className="space-y-6 flex flex-col justify-between">
                                    <div>
                                        {classification.category_for_display && (
                                            <InfoSection
                                                title="Categoria"
                                                icon={<Tag className="w-5 h-5" />}
                                            >
                                                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                                    {classification.category_for_display.icon_url ? (
                                                        <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-border bg-background flex-shrink-0">
                                                            <img
                                                                src={classification.category_for_display.icon_url}
                                                                alt={classification.category_for_display.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
                                                            <Slash className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <p className="font-medium">
                                                        {classification.category_for_display.name}
                                                    </p>
                                                </div>
                                            </InfoSection>
                                        )}

                                        {classification.message && (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold">Mensagem</h3>
                                                <p className="text-muted-foreground p-4 bg-muted/50 rounded-lg">
                                                    {classification.message}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <UserCard user={classification.user_for_display} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {status === "completed" && classification.result ? (
                        <ResultsCard classification={classification} />
                    ) : (
                        <EmptyState
                            status={status}
                            onReanalyze={handleReanalyze}
                            processing={processing}
                        />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
