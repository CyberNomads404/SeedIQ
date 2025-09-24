import { IUserShowProps } from "@/interfaces/IUser";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UserFormDialog } from "@/components/forms/form-user";
import { useState, useEffect } from "react";
import { userFormSchema } from "@/schemas/form-user-schema";
import { z } from "zod";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnDef,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { IAuditLog } from "@/interfaces/ILogs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { DEFAULT_AVATAR_URL } from "@/utils/constants";
import {
    User,
    Mail,
    Phone,
    Shield,
    Monitor,
    Smartphone,
    MapPin,
    Clock,
    CheckCircle,
    XCircle,
    Edit3,
    ChevronLeft,
    ChevronRight,
    Filter,
    X,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Search,
    Calendar,
    Settings
} from "lucide-react";
import { formatLocalDateTime } from "@/utils/dateTimeUtcLocal";

export default function Index({
    user,
    rolesForCreateOptions,
    logs,
    logsQueryParams = {},
    logsFilters = { events: [], types: [] }
}: IUserShowProps) {
    const [isUserFormOpen, setIsUserFormOpen] = useState<boolean>(false);
    const onAddUserForm = () => setIsUserFormOpen(!isUserFormOpen);

    const [logsFiltersState, setLogsFiltersState] = useState({
        search: logsQueryParams.logs_search ?? "",
        event: logsQueryParams.logs_event ?? "",
        type: logsQueryParams.logs_type ?? "",
        dateFrom: logsQueryParams.logs_date_from ?? "",
        dateTo: logsQueryParams.logs_date_to ?? "",
    });
    const [showLogsFilters, setShowLogsFilters] = useState(false);
    const [logsSort, setLogsSort] = useState<{ column: string; direction: "asc" | "desc" }>({
        column: logsQueryParams.logs_sort_column ?? "created_at",
        direction: logsQueryParams.logs_sort_direction ?? "desc"
    });

    useEffect(() => {
        setLogsFiltersState({
            search: logsQueryParams.logs_search ?? "",
            event: logsQueryParams.logs_event ?? "",
            type: logsQueryParams.logs_type ?? "",
            dateFrom: logsQueryParams.logs_date_from ?? "",
            dateTo: logsQueryParams.logs_date_to ?? "",
        });
        setLogsSort({
            column: logsQueryParams.logs_sort_column ?? "created_at",
            direction: logsQueryParams.logs_sort_direction ?? "desc"
        });
    }, [logsQueryParams]);

    const handleUpdate = (values: z.infer<ReturnType<typeof userFormSchema>>, external_id?: string) => {
        router.post(route('users.update', external_id), { ...values, _method: 'PUT' }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onAddUserForm();
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    const handleActiveToggle = () => {
        router.put(
            route("users.active", user.external_id),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleLogsPageChange = (page: number) => {
        router.get(
            route('users.show', user.external_id),
            {
                logs_page: page,
                logs_per_page: logs.per_page,
                logs_search: logsFiltersState.search,
                logs_event: logsFiltersState.event,
                logs_type: logsFiltersState.type,
                logs_date_from: logsFiltersState.dateFrom,
                logs_date_to: logsFiltersState.dateTo,
                logs_sort_column: logsSort.column,
                logs_sort_direction: logsSort.direction,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const applyLogsFilters = () => {
        router.get(
            route('users.show', user.external_id),
            {
                logs_page: 1,
                logs_per_page: logs.per_page,
                logs_search: logsFiltersState.search,
                logs_event: logsFiltersState.event,
                logs_type: logsFiltersState.type,
                logs_date_from: logsFiltersState.dateFrom,
                logs_date_to: logsFiltersState.dateTo,
                logs_sort_column: logsSort.column,
                logs_sort_direction: logsSort.direction,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const clearLogsFilters = () => {
        const emptyFilters = { search: "", event: "", type: "", dateFrom: "", dateTo: "" };
        setLogsFiltersState(emptyFilters);
        router.get(
            route('users.show', user.external_id),
            {
                logs_page: 1,
                logs_per_page: logs.per_page,
                logs_sort_column: logsSort.column,
                logs_sort_direction: logsSort.direction,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleLogsSort = (column: string) => {
        const newDirection: "asc" | "desc" = logsSort.column === column && logsSort.direction === "asc" ? "desc" : "asc";
        const newSort = { column, direction: newDirection };
        setLogsSort(newSort);

        router.get(
            route('users.show', user.external_id),
            {
                logs_page: 1,
                logs_per_page: logs.per_page,
                logs_search: logsFiltersState.search,
                logs_event: logsFiltersState.event,
                logs_type: logsFiltersState.type,
                logs_date_from: logsFiltersState.dateFrom,
                logs_date_to: logsFiltersState.dateTo,
                logs_sort_column: newSort.column,
                logs_sort_direction: newSort.direction,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const renderValues = (values: Record<string, any>) => {
        if (!values || Object.keys(values).length === 0) {
            return <span className="text-muted-foreground italic">Nenhum valor</span>;
        }

        return Object.entries(values).map(([key, value]) => (
            <div key={key} className="text-sm break-words">
                <strong className="break-words">{key}:</strong> <span className="break-words">{String(value)}</span>
            </div>
        ));
    };

    const columns: ColumnDef<IAuditLog>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "user_name",
            header: "Usuário",
        },
        {
            accessorKey: "auditable_type",
            header: ({ column }) => {
                const isSorted = logsSort.column === "auditable_type";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleLogsSort("auditable_type")}
                    >
                        Tipo
                        {isSorted ? (
                            logsSort.direction === "asc" ? (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            ) : (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            )
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
        },
        {
            accessorKey: "event",
            header: ({ column }) => {
                const isSorted = logsSort.column === "event";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleLogsSort("event")}
                    >
                        Evento
                        {isSorted ? (
                            logsSort.direction === "asc" ? (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            ) : (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            )
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
        },
        {
            header: "Valor Anterior",
            cell: ({ row }) => renderValues(row.original.old_values),
        },
        {
            header: "Valor Atualizado",
            cell: ({ row }) => renderValues(row.original.new_values),
        },
        {
            accessorKey: "ip_address",
            header: ({ column }) => {
                const isSorted = logsSort.column === "ip_address";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleLogsSort("ip_address")}
                    >
                        IP
                        {isSorted ? (
                            logsSort.direction === "asc" ? (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            ) : (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            )
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                const isSorted = logsSort.column === "created_at";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => handleLogsSort("created_at")}
                    >
                        Data
                        {isSorted ? (
                            logsSort.direction === "asc" ? (
                                <ArrowUp className="ml-2 h-4 w-4" />
                            ) : (
                                <ArrowDown className="ml-2 h-4 w-4" />
                            )
                        ) : (
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                        )}
                    </Button>
                );
            },
        },
    ];

    const table = useReactTable({
        data: logs.data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <AuthenticatedLayout
            header="Perfil do Usuário"
        >
            <Head title={`Perfil de ${user.name}`} />

            <div className="flex flex-1 flex-col gap-4 sm:gap-6 h-full w-full max-w-full overflow-hidden min-w-0">
                {/* Header Card com Avatar e Info Principal */}
                <Card className="overflow-hidden w-full min-w-0">
                    <div className="p-4 sm:p-8">
                        <div className="flex flex-col items-center gap-4 sm:gap-6 sm:flex-row">
                            {/* Avatar */}
                            <div className="relative">
                                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-background shadow-lg">
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
                                <div className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 border-2 border-background rounded-full flex items-center justify-center ${user.active ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                    {user.active ? (
                                        <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                    ) : (
                                        <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                    )}
                                </div>
                            </div>

                            {/* Info Principal */}
                            <div className="flex-1 text-center sm:text-left min-w-0">
                                <div className="flex flex-col items-center sm:items-start sm:flex-row gap-2 sm:gap-3 mb-2">
                                    <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">{user.name}</h1>
                                    <Badge
                                        variant={user.active ? "default" : "destructive"}
                                        className="w-fit flex-shrink-0"
                                    >
                                        {user.active ? "Ativo" : "Inativo"}
                                    </Badge>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground mb-3">
                                    <div className="flex items-center justify-center sm:justify-start gap-1 min-w-0">
                                        <Mail className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm sm:text-base break-all overflow-hidden text-ellipsis">{user.email}</span>
                                    </div>
                                    <div className="hidden sm:block text-muted-foreground/50">•</div>
                                    <div className="flex items-center justify-center sm:justify-start gap-1 min-w-0">
                                        <Shield className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm sm:text-base truncate">{user.role_user}</span>
                                    </div>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-1 text-muted-foreground justify-center sm:justify-start min-w-0">
                                        <Phone className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm sm:text-base truncate">{user.phone}</span>
                                    </div>
                                )}
                            </div>

                            {/* Botões de ação */}
                            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto flex-shrink-0">
                                {/* Switch para ativar/desativar */}
                                <div className="flex items-center justify-between w-full sm:w-auto gap-2 px-3 py-2 border rounded-lg text-sm">
                                    <span className="font-medium text-muted-foreground whitespace-nowrap">
                                        {user.active ? "Ativo" : "Inativo"}
                                    </span>
                                    <Switch
                                        checked={user.active}
                                        onCheckedChange={handleActiveToggle}
                                    />
                                </div>

                                {/* Botão Editar */}
                                <Button
                                    onClick={onAddUserForm}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-2 w-full sm:w-auto"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Editar</span>
                                </Button>

                                {/* Gerenciar outros recursos do usuário */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full sm:w-auto flex items-center gap-2"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Gerenciar</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] max-w-[calc(100vw-2rem)] mx-auto">
                                        <DialogHeader>
                                            <DialogTitle className="text-lg">
                                                Gerenciar Usuário
                                            </DialogTitle>
                                            <DialogDescription className="text-sm">
                                                Visualize e edite as informações
                                                relacionadas ao usuário selecionado.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-3 py-4">
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start gap-2 text-sm"
                                                onClick={() => {
                                                    // Adicionar lógica para abrir dados do contrato
                                                    console.log('Abrir dados do contrato');
                                                }}
                                            >
                                                <User className="w-4 h-4" />
                                                Dados do Contrato
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start gap-2 text-sm"
                                                onClick={() => {
                                                    // Adicionar lógica para histórico de ações
                                                    console.log('Abrir histórico de ações');
                                                }}
                                            >
                                                <Clock className="w-4 h-4" />
                                                Histórico Completo
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start gap-2 text-sm"
                                                onClick={() => {
                                                    // Adicionar lógica para configurações avançadas
                                                    console.log('Abrir configurações avançadas');
                                                }}
                                            >
                                                <Settings className="w-4 h-4" />
                                                Configurações Avançadas
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Grid de Informações */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
                    {/* Informações Pessoais */}
                    <Card className="w-full overflow-hidden min-w-0">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="w-5 h-5" />
                                Informações Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-border">
                                <span className="text-muted-foreground text-sm">Status da conta</span>
                                <div className="flex items-center gap-2">
                                    {user.active ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-sm text-foreground">Ativo</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-4 h-4 text-red-500" />
                                            <span className="text-sm text-muted-foreground">Inativo</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2 border-b border-border">
                                <span className="text-muted-foreground text-sm">Email verificado</span>
                                <div className="flex items-center gap-2">
                                    {user.email_verified_at ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="text-sm text-foreground">
                                                {formatLocalDateTime(user.email_verified_at)}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-4 h-4 text-red-500" />
                                            <span className="text-sm text-muted-foreground">Não verificado</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2 border-b border-border">
                                <span className="text-muted-foreground text-sm">Criado em</span>
                                <span className="text-sm text-foreground">{formatLocalDateTime(user.created_at)}</span>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <span className="text-muted-foreground text-sm">Última atualização</span>
                                <span className="text-sm text-foreground">{formatLocalDateTime(user.updated_at)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Atividade de Login */}
                    <Card className="w-full overflow-hidden min-w-0">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Clock className="w-5 h-5" />
                                Atividade de Login
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-3">
                                {/* Login Web */}
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Monitor className="w-4 h-4 text-blue-500" />
                                        <span className="font-medium text-foreground text-sm">Último login web</span>
                                    </div>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <div className="flex items-center justify-between">
                                            <span>Data:</span>
                                            <span className="text-foreground text-xs">
                                                {user.last_session_web?.last_activity
                                                    ? formatLocalDateTime(user.last_session_web.last_activity)
                                                    : "Nunca"
                                                }
                                            </span>
                                        </div>
                                        {user.last_session_web?.ip_address && (
                                            <div className="flex items-center justify-between">
                                                <span>IP:</span>
                                                <div className="flex items-center gap-1 min-w-0">
                                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                                    <span className="text-foreground text-xs break-all overflow-hidden text-ellipsis max-w-[120px]">{user.last_session_web.ip_address}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Login API */}
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Smartphone className="w-4 h-4 text-green-500" />
                                        <span className="font-medium text-foreground text-sm">Último login API</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <div className="flex items-center justify-between">
                                            <span>Data:</span>
                                            <span className="text-foreground text-xs">
                                                {user.last_session_api?.last_used_at
                                                    ? formatLocalDateTime(user.last_session_api.last_used_at)
                                                    : "Nunca"
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Logs de Auditoria */}
                <Card className="w-full min-w-0">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col gap-3">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    Histórico de Atividades
                                    {(logsFiltersState.search || logsFiltersState.event || logsFiltersState.type || logsFiltersState.dateFrom || logsFiltersState.dateTo) && (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            Filtrado
                                        </span>
                                    )}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    Registro completo de todas as ações realizadas pelo usuário no sistema {" "}
                                    {logs.total && (
                                        <span className="block mt-1 text-xs">
                                            Mostrando {logs.from || 0} a {logs.to || 0} de {logs.total} registros
                                        </span>
                                    )}
                                </CardDescription>
                            </div>

                            {/* Controles de Filtro */}
                            <div className="flex justify-end">
                                <Popover open={showLogsFilters} onOpenChange={setShowLogsFilters}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`${(logsFiltersState.search || logsFiltersState.event || logsFiltersState.type || logsFiltersState.dateFrom || logsFiltersState.dateTo) ? 'border-blue-500 bg-blue-50' : ''}`}
                                        >
                                            <Filter className="w-4 h-4 mr-2" />
                                            <span className="hidden sm:inline">Filtros</span>
                                            {(logsFiltersState.search || logsFiltersState.event || logsFiltersState.type || logsFiltersState.dateFrom || logsFiltersState.dateTo) && (
                                                <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                                    {[logsFiltersState.search, logsFiltersState.event, logsFiltersState.type, logsFiltersState.dateFrom, logsFiltersState.dateTo].filter(Boolean).length}
                                                </span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 sm:w-96 max-w-[calc(100vw-2rem)]" align="end">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-sm">Filtros de Atividade</h4>
                                                {(logsFiltersState.search || logsFiltersState.event || logsFiltersState.type || logsFiltersState.dateFrom || logsFiltersState.dateTo) && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={clearLogsFilters}
                                                        className="h-auto p-1 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <Label htmlFor="logs-search" className="text-xs font-medium">
                                                        Busca Geral
                                                    </Label>
                                                    <Input
                                                        id="logs-search"
                                                        placeholder="Buscar..."
                                                        value={logsFiltersState.search}
                                                        onChange={(e) => setLogsFiltersState(prev => ({ ...prev, search: e.target.value }))}
                                                        className="mt-1 text-sm"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <div>
                                                        <Label htmlFor="logs-event" className="text-xs font-medium">
                                                            Evento
                                                        </Label>
                                                        <Select
                                                            value={logsFiltersState.event || "all"}
                                                            onValueChange={(value) => setLogsFiltersState(prev => ({ ...prev, event: value === "all" ? "" : value }))}
                                                        >
                                                            <SelectTrigger className="mt-1 text-sm">
                                                                <SelectValue placeholder="Todos..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">Todos</SelectItem>
                                                                {logsFilters.events.map(event => (
                                                                    <SelectItem key={event} value={event}>
                                                                        {event.charAt(0).toUpperCase() + event.slice(1)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div>
                                                        <Label htmlFor="logs-type" className="text-xs font-medium">
                                                            Tipo
                                                        </Label>
                                                        <Select
                                                            value={logsFiltersState.type || "all"}
                                                            onValueChange={(value) => setLogsFiltersState(prev => ({ ...prev, type: value === "all" ? "" : value }))}
                                                        >
                                                            <SelectTrigger className="mt-1 text-sm">
                                                                <SelectValue placeholder="Todos..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">Todos</SelectItem>
                                                                {logsFilters.types.map(type => (
                                                                    <SelectItem key={type} value={type}>
                                                                        {type}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <Label htmlFor="logs-date-from" className="text-xs font-medium">
                                                            Data Inicial
                                                        </Label>
                                                        <Input
                                                            id="logs-date-from"
                                                            type="date"
                                                            value={logsFiltersState.dateFrom}
                                                            onChange={(e) => setLogsFiltersState(prev => ({ ...prev, dateFrom: e.target.value }))}
                                                            className="mt-1 text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="logs-date-to" className="text-xs font-medium">
                                                            Data Final
                                                        </Label>
                                                        <Input
                                                            id="logs-date-to"
                                                            type="date"
                                                            value={logsFiltersState.dateTo}
                                                            onChange={(e) => setLogsFiltersState(prev => ({ ...prev, dateTo: e.target.value }))}
                                                            className="mt-1 text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    onClick={applyLogsFilters}
                                                    size="sm"
                                                    className="flex-1 text-sm"
                                                >
                                                    Aplicar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setShowLogsFilters(false)}
                                                    size="sm"
                                                    className="text-sm"
                                                >
                                                    Fechar
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </CardHeader>
                    <Separator className="mb-3" />
                    <CardContent className="p-0">
                        {/* Mobile: Cards para cada log */}
                        <div className="block sm:hidden">
                            <div className="space-y-3 p-4">
                                {logs.data && logs.data.length > 0 ? (
                                    logs.data.map((log: IAuditLog, index: number) => (
                                        <Card key={log.id} className="border-l-4 border-l-blue-500">
                                            <CardContent className="p-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <Badge variant="outline" className="text-xs flex-shrink-0">
                                                                #{log.id}
                                                            </Badge>
                                                            <Badge variant="secondary" className="text-xs truncate">
                                                                {log.event?.charAt(0).toUpperCase() + log.event?.slice(1)}
                                                            </Badge>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                                                            {formatLocalDateTime(log.created_at)}
                                                        </span>
                                                    </div>

                                                    <div className="text-sm">
                                                        <div className="font-medium text-foreground mb-1">
                                                            {log.user_name}
                                                        </div>
                                                        <div className="text-muted-foreground text-xs">
                                                            {log.auditable_type} • IP: {log.ip_address}
                                                        </div>
                                                    </div>

                                                    {(log.old_values && Object.keys(log.old_values).length > 0) && (
                                                        <div className="text-xs">
                                                            <span className="font-medium text-muted-foreground">Valor Anterior:</span>
                                                            <div className="mt-1 break-words">
                                                                {renderValues(log.old_values)}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {(log.new_values && Object.keys(log.new_values).length > 0) && (
                                                        <div className="text-xs">
                                                            <span className="font-medium text-muted-foreground">Valor Atualizado:</span>
                                                            <div className="mt-1 break-words">
                                                                {renderValues(log.new_values)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        Nenhum registro encontrado
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Desktop: Tabela tradicional */}
                        <div className="hidden sm:block">
                            <div className="overflow-x-auto">
                                <Table className="min-w-full">
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <TableHead key={header.id} className="text-xs">
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows.length > 0 ? (
                                            table.getRowModel().rows.map((row) => (
                                                <TableRow key={row.id}>
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id} className="max-w-[200px] break-words text-xs p-2">
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground text-sm">
                                                    Nenhum registro encontrado
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Paginação */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t min-w-0">
                            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                                Mostrando {logs.from || 0} a {logs.to || 0} de {logs.total} registros
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleLogsPageChange(logs.current_page - 1)}
                                    disabled={!logs.prev_page_url}
                                    className="flex items-center gap-1 text-xs"
                                >
                                    <ChevronLeft className="w-3 h-3" />
                                    <span className="hidden sm:inline">Anterior</span>
                                </Button>

                                <div className="flex items-center gap-1 text-xs px-2">
                                    {logs.current_page} de {logs.last_page}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleLogsPageChange(logs.current_page + 1)}
                                    disabled={!logs.next_page_url}
                                    className="flex items-center gap-1 text-xs"
                                >
                                    <span className="hidden sm:inline">Próximo</span>
                                    <ChevronRight className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <UserFormDialog
                data={user}
                external_id={user.external_id}
                isOpen={isUserFormOpen}
                rolesForCreateOptions={rolesForCreateOptions}
                setIsOpen={setIsUserFormOpen}
                onSubmit={handleUpdate}
            />
        </AuthenticatedLayout>
    );
}
