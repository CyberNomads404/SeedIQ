import React, { useMemo, useState } from "react";
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
    Mail
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

const statusClassMap: Record<string, string> = {
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
    registered: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    in_progress: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    failed: "bg-red-100 text-red-800 hover:bg-red-200",
    canceled: "bg-gray-200 text-gray-800",
    processing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
};

const safeStatusKey = (s?: string) => {
    if (!s) return "registered";
    if (s === "processing") return "in_progress";
    return s;
};

const formatDate = (value?: string | null) => {
    if (!value) return "—";
    try {
        const d = new Date(value);
        if (isNaN(d.getTime())) return value;
        return d.toLocaleString();
    } catch {
        return value;
    }
};

export default function Show({ classification }: IClassificationShowProps) {
    const statusKey = useMemo(() => safeStatusKey(classification.status), [classification.status]);

    const hasResultObject = Boolean(classification.result);
    const totalGrains = useMemo(() => {
        if (!hasResultObject) return 0;
        const burned = classification.result?.burned ?? 0;
        const greenish = classification.result?.greenish ?? 0;
        const good = classification.result?.good_grains ?? 0;
        return burned + greenish + good;
    }, [classification.result, hasResultObject]);

    const getPercentage = (value?: number | null) => {
        const v = value ?? 0;
        if (totalGrains === 0) return "0.0";
        return ((v / totalGrains) * 100).toFixed(1);
    };

    const [isRetrying, setIsRetrying] = useState(false);
    const [retryError, setRetryError] = useState<string | null>(null);
    const [retrySuccess, setRetrySuccess] = useState<string | null>(null);

    const StatusBadge = ({ status }: { status?: string }) => {
        const key = safeStatusKey(status);
        const classes = statusClassMap[key] ?? "bg-gray-100 text-gray-800";
        return (
            <Badge variant="secondary" className={classes}>
                {classification.status_label ?? classification.status ?? key}
            </Badge>
        );
    };

    const InfoRow = ({
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

    const ResultsCard = () => {
        if (statusKey !== "completed" || !classification.result) return null;

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
                        <Card className="border-red-200 bg-red-50/50">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-red-100 rounded-full">
                                        <Zap className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-red-700">Grãos Queimados</p>
                                        <div className="flex items-baseline space-x-2">
                                            <p className="text-2xl font-bold text-red-800">
                                                {classification.result?.burned ?? 0}
                                            </p>
                                            <p className="text-sm text-red-600">({getPercentage(classification.result?.burned)}%)</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-yellow-200 bg-yellow-50/50">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-yellow-100 rounded-full">
                                        <Leaf className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-yellow-700">Grãos Esverdeados</p>
                                        <div className="flex items-baseline space-x-2">
                                            <p className="text-2xl font-bold text-yellow-800">{classification.result?.greenish ?? 0}</p>
                                            <p className="text-sm text-yellow-600">({getPercentage(classification.result?.greenish)}%)</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-green-200 bg-green-50/50">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <Sparkles className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-green-700">Grãos Bons</p>
                                        <div className="flex items-baseline space-x-2">
                                            <p className="text-2xl font-bold text-green-800">
                                                {classification.result?.good_grains ?? 0}
                                            </p>
                                            <p className="text-sm text-green-600">({getPercentage(classification.result?.good_grains)}%)</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold mb-4">Resumo da Análise</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-primary">{totalGrains}</p>
                                <p className="text-sm text-muted-foreground">Total de Grãos</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{getPercentage(classification.result?.good_grains)}%</p>
                                <p className="text-sm text-muted-foreground">Qualidade Boa</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">{getPercentage(classification.result?.greenish)}%</p>
                                <p className="text-sm text-muted-foreground">Necessita Atenção</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-600">{getPercentage(classification.result?.burned)}%</p>
                                <p className="text-sm text-muted-foreground">Problemas</p>
                            </div>
                        </div>

                        {classification.result && (
                            <div className="mt-6 pt-6 border-t">
                                <details className="space-y-4">
                                    <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                                        Ver informações técnicas
                                    </summary>
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-2">
                                            <strong>Resultado processado:</strong> {formatDate(classification.result.created_at_human ?? classification.result.created_at)}
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            <strong>Última atualização:</strong> {formatDate(classification.result.updated_at_human ?? classification.result.updated_at)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            <strong>ID do resultado:</strong> {classification.result.external_id}
                                        </p>
                                    </div>
                                </details>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    const { processing, post } = useForm({});

    const handleReanalyze = () => {
        post(route("classifications.api.reanalyze", classification.external_id), {
            preserveScroll: true,
            onSuccess: () => {
                setRetrySuccess('A análise foi reenviada com sucesso.');
                setRetryError(null);
                setTimeout(() => window.location.reload(), 900);
            },
            onError: (errors: any) => {
                const msg = (errors && errors.message) || 'Falha ao reenviar a análise.';
                setRetryError(msg);
            },
        });
    };

    const EmptyState = () => {
        const isFailed = statusKey === "failed";
        const isInProgress = statusKey === "in_progress";
        const isRegistered = statusKey === "registered";
        const isCanceled = statusKey === "canceled";

        const title = isFailed ? "Falha no Processamento" : isInProgress ? "Análise em Processamento" : isCanceled ? "Análise Cancelada" : isRegistered ? "Aguardando Processamento" : "Status";

        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                            {isFailed ? <CircleX className="w-8 h-8 text-muted-foreground" /> : <BarChart3 className="w-8 h-8 text-muted-foreground" />}
                        </div>

                        <h3 className="text-lg font-semibold">{title}</h3>

                        <p className="text-muted-foreground max-w-md mx-auto">
                            {isFailed
                                ? "A análise desta imagem falhou. Você pode tentar reanalisar a imagem abaixo."
                                : isInProgress
                                    ? "Os resultados da análise ainda não estão disponíveis. Isso pode levar alguns minutos para ser processado."
                                    : isCanceled
                                        ? "Esta análise foi cancelada."
                                        : "A análise foi registrada e está na fila para processamento."
                            }
                        </p>

                        {isFailed && (
                            <>
                                <p className="text-red-600 text-sm">Houve um problema no processamento desta análise.</p>
                                <div className="flex items-center justify-center space-x-2">
                                    <Button onClick={handleReanalyze} disabled={processing} className="w-fit">
                                        {processing ? "Reanalisando..." : "Reanalisar"}
                                    </Button>
                                </div>

                                {retryError && <p className="text-red-600 text-sm mt-2">{retryError}</p>}
                                {retrySuccess && <p className="text-green-600 text-sm mt-2">{retrySuccess}</p>}
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={route("classifications.index")}
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Voltar para Classificações
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Detalhes da Classificação" />
            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <CardTitle className="text-2xl font-bold">Resultado da Classificação</CardTitle>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Criado em {formatDate(classification.created_at ?? classification.created_at_human)}
                                        </div>
                                    </div>
                                </div>

                                <StatusBadge status={classification.status} />
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <InfoRow title="Imagem Analisada" icon={<ImageIcon className="w-5 h-5 mr-2" />}>
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
                                    </InfoRow>
                                </div>

                                <div className="space-y-6 flex flex-col justify-between">
                                    <div>
                                        {classification.category_for_display && (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold flex items-center">
                                                    <Tag className="w-5 h-5 mr-2" />
                                                    Categoria
                                                </h3>


                                                <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                                                    {classification.category_for_display.icon_url && (
                                                        <img
                                                            src={classification.category_for_display.icon_url}
                                                            alt={classification.category_for_display.name}
                                                            className="w-8 h-8"
                                                        />
                                                    )}
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-3">
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
                                                            </div>
                                                            <p className="font-medium">{classification.category_for_display.name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {classification.message && (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold">Mensagem</h3>
                                                <p className="text-muted-foreground p-4 bg-muted/50 rounded-lg">{classification.message}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        {classification.user_for_display && (
                                            <Button
                                                variant="ghost"
                                                className="w-full py-12 px-6 bg-muted/50 hover:bg-muted/50 transition-colors"
                                                onClick={() => router.get(route("users.show", { uuid: classification.user_for_display?.external_id }))}
                                            >
                                                <div className="flex items-center gap-4 rounded-lg w-full">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-border">
                                                        {classification.user_for_display.avatar_url ? (
                                                            <img src={classification.user_for_display.avatar_url} alt={classification.user_for_display.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                                                <span className="font-medium">{classification.user_for_display.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0 w-full">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <h4 className="font-medium text-foreground text-sm truncate">{classification.user_for_display.name}</h4>
                                                            <Badge className="text-xs" variant={classification.user_for_display.active ? 'secondary' : 'outline'}>
                                                                {classification.user_for_display.role_user ?? (classification.user_for_display.active ? 'Ativo' : 'Inativo')}
                                                            </Badge>
                                                        </div>

                                                        <div className="mt-1 text-xs text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-1 w-full">
                                                            <div className="flex items-center gap-2 truncate w-full">
                                                                <Mail className="w-3 h-3" />
                                                                <span className="truncate">{classification.user_for_display.email}</span>
                                                            </div>
                                                        </div>

                                                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-4">
                                                            <p className="text-xs text-muted-foreground opacity-80">
                                                                Clique para ver mais detalhes
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {statusKey === "completed" && classification.result ? <ResultsCard /> : <EmptyState />}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
