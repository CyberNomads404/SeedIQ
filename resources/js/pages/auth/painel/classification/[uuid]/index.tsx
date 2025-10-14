

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router } from "@inertiajs/react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { formatLocalDateTime } from "@/utils/dateTimeUtcLocal";
import { AttachmentPreview, AttachmentPreviewHandle } from "@/components/attachment-preview";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, FileText, Smartphone, Monitor, User as UserIcon, Globe, File as FileIcon, Mail, Calendar, Eye, EyeOff, Download, Eye as EyeIcon } from "lucide-react";
import type { Feedback } from "@/interfaces/IFeedback";
import type { IUser } from "@/interfaces/IUser";

interface FeedbackDetailProps {
    feedback: Feedback;
    user: IUser | null;
}

import React, { useRef } from "react";
import { DEFAULT_AVATAR_URL } from "@/utils/constants";
const FeedbackDetail: React.FC<FeedbackDetailProps> = ({ feedback, user }) => {
    const isMobile = !!feedback.app_version;
    const previewRef = useRef<AttachmentPreviewHandle>(null);
    const openPreview = () => {
        if (previewRef.current) {
            previewRef.current.open();
        }
    };

    const goToUser = () => {
        if (user) {
            router.get(route("users.show", user.external_id), {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };
    return (
        <AuthenticatedLayout header="Detalhes do Feedback">
            <Head title={`Feedback #${feedback.id}`} />
            <div className="w-full mx-auto flex flex-col gap-8 px-2 py-4">
                <Card className="w-full shadow-lg border-2 border-primary/30">
                    <CardHeader className="flex flex-col gap-4 pb-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-2xl">{feedback.type_label}</span>
                                <span className="text-xs text-muted-foreground">ID: #{feedback.id}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                {formatLocalDateTime(feedback.created_at)}
                                {feedback.read_at ? (
                                    <><Eye className="w-4 h-4 ml-2" /><span>Lido: {formatLocalDateTime(feedback.read_at)}</span></>
                                ) : (
                                    <><EyeOff className="w-4 h-4 ml-2" /><span>Não lido</span></>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            {isMobile ? (
                                <Badge variant="default" className="flex items-center gap-1"><Smartphone className="w-4 h-4" />Mobile{feedback.app_version ? ` (v${feedback.app_version})` : ''}</Badge>
                            ) : (
                                <Badge variant="outline" className="flex items-center gap-1"><Monitor className="w-4 h-4" />Web</Badge>
                            )}
                            {feedback.device && <Badge variant="secondary" className="flex items-center gap-1"><Globe className="w-4 h-4" />{feedback.device}</Badge>}
                            {feedback.page && <Badge variant="secondary" className="flex items-center gap-1"><Globe className="w-4 h-4" />{feedback.page}</Badge>}
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-8 pt-2">
                        {/* Informações do Feedback */}
                        <div className="flex flex-col gap-4">
                            <span className="font-semibold text-lg mb-1">Informações do Feedback</span>
                            <div className="bg-muted rounded p-4 whitespace-pre-line text-base border border-primary/10 shadow-sm w-full">
                                {feedback.message}
                            </div>
                            {feedback.user_agent && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Monitor className="w-4 h-4" />
                                    <span className="font-semibold">User Agent:</span>
                                    <span className="break-all">{feedback.user_agent}</span>
                                </div>
                            )}
                            {feedback.ip_address && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Globe className="w-4 h-4" />
                                    <span className="font-semibold">IP:</span>
                                    <span>{feedback.ip_address}</span>
                                </div>
                            )}
                        </div>
                        {/* Anexo */}
                        <div className="flex flex-col gap-2">
                            <span className="font-semibold text-lg mb-1">Anexo</span>
                            {feedback.attachment_url ? (
                                <div className="flex flex-col gap-1">
                                    <div className="flex flex-row gap-2 items-center">
                                        <button
                                            onClick={openPreview}
                                            className="flex items-center gap-1 px-3 py-1 rounded bg-primary text-white hover:bg-primary/90 text-xs font-medium shadow dark:bg-black dark:text-white dark:hover:bg-neutral-900"
                                            title="Visualizar anexo"
                                        >
                                            <EyeIcon className="w-4 h-4" /> Visualizar
                                        </button>
                                        <button
                                            onClick={() => {
                                                const link = document.createElement('a');
                                                link.href = feedback.attachment_url!;
                                                link.target = '_blank';
                                                link.download = '';
                                                document.body.appendChild(link);
                                                link.click();
                                                document.body.removeChild(link);
                                            }}
                                            className="flex items-center gap-1 px-3 py-1 rounded bg-muted text-primary hover:bg-primary/10 text-xs font-medium border border-primary/20 shadow"
                                            title="Baixar anexo"
                                        >
                                            <Download className="w-4 h-4" /> Baixar
                                        </button>
                                        <AttachmentPreview ref={previewRef} url={feedback.attachment_url} mime={feedback.mime_type} hideTrigger />
                                    </div>
                                    {feedback.mime_type && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                            <span className="font-semibold">Tipo do arquivo:</span> {feedback.mime_type}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span className="text-muted-foreground italic">Nenhum anexo</span>
                            )}
                        </div>
                        {/* Usuário */}
                        <div className="flex flex-col gap-2">
                            <span className="font-semibold text-lg mb-1">Usuário</span>
                            {user ? (
                                <button
                                    onClick={goToUser}
                                    className="flex items-center gap-3 px-2 py-2 rounded hover:bg-muted transition border border-primary/10"
                                    title="Ver detalhes do usuário"
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={
                                                user.avatar_url && user.avatar_url.trim() !== ""
                                                    ? user.avatar_url
                                                    : DEFAULT_AVATAR_URL
                                            }
                                        />
                                        <AvatarFallback className="text-lg sm:text-xl font-semibold bg-orange-500 text-white">
                                            {user.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start">
                                        <span className="font-semibold">{user.name}</span>
                                        {user.email && <span className="flex items-center gap-1 text-xs"><Mail className="w-4 h-4" />{user.email}</span>}
                                    </div>
                                </button>
                            ) : (
                                <span className="text-muted-foreground italic">Não informado</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
};

export default FeedbackDetail;
