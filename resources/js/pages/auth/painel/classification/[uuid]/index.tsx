import React from "react";
import { Head, Link } from "@inertiajs/react";
import { ChevronLeft, Clock, User, Tag, Image as ImageIcon, BarChart3, Zap, Leaf, Sparkles, Slash } from "lucide-react";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IClassification } from "@/interfaces/IClassification";

const route = (window as any).route;

interface IClassificationShowProps {
    classification: IClassification;
}

const statusVariants = {
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
    registered: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    processing: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    failed: "bg-red-100 text-red-800 hover:bg-red-200",
};

export default function Show({ classification }: IClassificationShowProps) {
    const hasResults = classification.result &&
        (classification.result.burned !== null ||
            classification.result.greenish !== null ||
            classification.result.good_grains !== null);

    const totalGrains = hasResults
        ? (classification.result?.burned || 0) +
        (classification.result?.greenish || 0) +
        (classification.result?.good_grains || 0)
        : 0;

    const getPercentage = (value: number | null | undefined) => {
        if (!value || totalGrains === 0) return 0;
        return ((value / totalGrains) * 100).toFixed(1);
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
                                    <CardTitle className="text-2xl font-bold">
                                        Resultado da Classificação
                                    </CardTitle>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Criado {classification.created_at_human || 'em data desconhecida'}
                                        </div>
                                        {classification.user_for_display && (
                                            <div className="flex items-center">
                                                <User className="w-4 h-4 mr-1" />
                                                {classification.user_for_display.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={statusVariants[classification.status as keyof typeof statusVariants]}
                                >
                                    {classification.status_label || classification.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold flex items-center">
                                        <ImageIcon className="w-5 h-5 mr-2" />
                                        Imagem Analisada
                                    </h3>
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
                                </div>

                                <div className="space-y-6">
                                    {classification.category_for_display && (
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold flex items-center">
                                                <Tag className="w-5 h-5 mr-2" />
                                                Categoria
                                            </h3>
                                            <div className="flex items-center gap-3 min-w-[160px]">
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
                                            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                                                {classification.category_for_display.icon_url && (
                                                    <img
                                                        src={classification.category_for_display.icon_url}
                                                        alt={classification.category_for_display.name}
                                                        className="w-8 h-8"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium">{classification.category_for_display.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Tag: {classification.category_for_display.tag}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
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
                            </div>
                        </CardContent>
                    </Card>

                    {hasResults ? (
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
                                                            {classification.result?.burned || 0}
                                                        </p>
                                                        <p className="text-sm text-red-600">
                                                            ({getPercentage(classification.result?.burned)}%)
                                                        </p>
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
                                                        <p className="text-2xl font-bold text-yellow-800">
                                                            {classification.result?.greenish || 0}
                                                        </p>
                                                        <p className="text-sm text-yellow-600">
                                                            ({getPercentage(classification.result?.greenish)}%)
                                                        </p>
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
                                                            {classification.result?.good_grains || 0}
                                                        </p>
                                                        <p className="text-sm text-green-600">
                                                            ({getPercentage(classification.result?.good_grains)}%)
                                                        </p>
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
                                            <p className="text-2xl font-bold text-green-600">
                                                {getPercentage(classification.result?.good_grains)}%
                                            </p>
                                            <p className="text-sm text-muted-foreground">Qualidade Boa</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-yellow-600">
                                                {getPercentage(classification.result?.greenish)}%
                                            </p>
                                            <p className="text-sm text-muted-foreground">Necessita Atenção</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-red-600">
                                                {getPercentage(classification.result?.burned)}%
                                            </p>
                                            <p className="text-sm text-muted-foreground">Problemas</p>
                                        </div>
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
                                                    <strong>Resultado processado:</strong> {classification.result.created_at_human}
                                                </p>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    <strong>Última atualização:</strong> {classification.result.updated_at_human}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    <strong>ID do resultado:</strong> {classification.result.external_id}
                                                </p>
                                            </div>
                                        </details>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                        <BarChart3 className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Análise em Processamento</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        Os resultados da análise ainda não estão disponíveis.
                                        Isso pode levar alguns minutos para ser processado.
                                    </p>
                                    {classification.status === 'failed' && (
                                        <p className="text-red-600 text-sm">
                                            Houve um problema no processamento desta análise.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
