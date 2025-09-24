import { useEffect, useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import { MoreHorizontal, Clipboard, ClipboardCheck, ArrowUp, ArrowDown, ArrowUpDown, Filter, X } from "lucide-react";

import { DataTable } from "@/components/data-table";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { ColumnDef } from "@tanstack/react-table";
import { useHasAnyPermission, useHasPermission } from "@/utils/permissions";
import { IUser, IUserProps } from "@/interfaces/IUser";
import { UserFormDialog } from "@/components/forms/form-user";
import { Switch } from "@/components/ui/switch";
import { IRoleForCreateOptions } from "@/interfaces/ISelect";
import { userFormSchema } from "@/schemas/form-user-schema";
import { z } from "zod";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { AttachmentPreview } from "@/components/attachment-preview";
import { Feedback, FeedbackIndexProps } from "@/interfaces/IFeedback";

import { Eye, Trash2 } from "lucide-react";
import { useFeedbackTypes } from "@/hooks/use-feedback-types";
import { DatePicker, DateTimePicker } from "@/components/ui/date-picker";
import { format, parseISO } from "date-fns";
import { formatLocalDateTime, localToUtcIso, utcIsoToLocalInput } from "@/utils/dateTimeUtcLocal";

const getColumns = (
    sort: { column: string; direction: "asc" | "desc" },
    onSort: (column: string) => void
): ColumnDef<Feedback>[] => [
        {
            accessorKey: "type_label",
            header: ({ column }) => {
                const isSorted = sort.column === "type";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort("type")}
                    >
                        Tipo
                        {isSorted ? (
                            sort.direction === "asc" ? (
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
            cell: ({ row }) => <span>{row.original.type_label}</span>,
        },
        {
            accessorKey: "message",
            header: ({ column }) => {
                const isSorted = sort.column === "message";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort("message")}
                    >
                        Mensagem
                        {isSorted ? (
                            sort.direction === "asc" ? (
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
            cell: ({ row }) => (
                <span title={row.original.message} className="truncate max-w-[250px] block">
                    {row.original.message.length > 40 ? `${row.original.message.slice(0, 40)}...` : row.original.message}
                </span>
            ),
        },
        {
            accessorKey: "attachment",
            header: () => <div className="text-center">Anexo</div>,
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    {row.original.attachment_url ? (
                        <AttachmentPreview url={row.original.attachment_url} mime={row.original.mime_type} iconSize={24} />
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "device",
            header: ({ column }) => {
                const isSorted = sort.column === "device";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort("device")}
                    >
                        Dispositivo
                        {isSorted ? (
                            sort.direction === "asc" ? (
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
            cell: ({ row }) => <span>{row.original.device || '-'}</span>,
        },
        {
            accessorKey: "page",
            header: ({ column }) => {
                const isSorted = sort.column === "page";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort("page")}
                    >
                        Página
                        {isSorted ? (
                            sort.direction === "asc" ? (
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
            cell: ({ row }) => <span>{row.original.page || '-'}</span>,
        },
        {
            accessorKey: "read_at",
            header: ({ column }) => {
                const isSorted = sort.column === "read_at";
                return (
                    <Button
                        variant="ghost"
                        className="w-full flex justify-center items-center h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort("read_at")}
                    >
                        Lido
                        {isSorted ? (
                            sort.direction === "asc" ? (
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
            cell: ({ row }) => {
                const isRead = !!row.original.read_at;
                const handleChange = () => {
                    router.put(route("feedbacks.switch", row.original.external_id), {}, {
                        preserveState: true,
                        preserveScroll: true,
                    });
                };
                return (
                    <div className="flex justify-center items-center gap-2">
                        <Switch checked={isRead} onCheckedChange={handleChange} />
                    </div>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => {
                const isSorted = sort.column === "created_at";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort("created_at")}
                    >
                        Criado em
                        {isSorted ? (
                            sort.direction === "asc" ? (
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
            cell: ({ row }) => {
                const value = row.original.created_at;
                if (!value) return <span>-</span>;
                try {
                    return <span>{formatLocalDateTime(value)}</span>;
                } catch {
                    return <span>-</span>;
                }
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const feedback = row.original;
                const [isOpenAlertDelete, setIsOpenAlertDelete] = useState(false);
                const onAlertDelete = () => setIsOpenAlertDelete(!isOpenAlertDelete);
                const canView = useHasPermission("feedbacks_list");
                const canDelete = useHasPermission("feedbacks_delete");
                if (!canView && !canDelete) return null;
                return (
                    <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Opções</span>
                                    <MoreHorizontal />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                {canView && (
                                    <Link href={route("feedbacks.show", feedback.external_id)}>
                                        <DropdownMenuItem>
                                            Visualizar
                                        </DropdownMenuItem>
                                    </Link>
                                )}
                                <DropdownMenuSeparator />
                                {canDelete && (
                                    <DropdownMenuItem onClick={onAlertDelete} className="text-red-600">
                                        Deletar
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialog open={isOpenAlertDelete}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente esse feedback do sistema.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={onAlertDelete}>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            router.delete(route("feedbacks.destroy", feedback.external_id), {
                                                preserveState: true,
                                                preserveScroll: true,
                                            });
                                            onAlertDelete();
                                        }}
                                        className="bg-red-500 hover:bg-red-900"
                                    >
                                        Continuar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                );
            },
        },
    ];

export default function Index({ feedbacks, queryParams, can }: FeedbackIndexProps) {
    const [feedbackData, setFeedbackData] = useState<Feedback[]>(feedbacks.data);
    const [currentPage, setCurrentPage] = useState(feedbacks.current_page);
    const [lastPage, setLastPage] = useState(feedbacks.last_page);
    const [perPage, setPerPage] = useState(feedbacks.per_page);
    const [searchValue, setSearchValue] = useState(queryParams.search ?? "");
    const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" }>({
        column: queryParams.sort_column ?? "created_at",
        direction: queryParams.sort_direction ?? "desc"
    });

    const [columns, setColumns] = useState(getColumns(sort, handleSort));

    useEffect(() => {
        setFeedbackData(feedbacks.data);
        setColumns(getColumns(sort, handleSort));
        setCurrentPage(feedbacks.current_page);
        setLastPage(feedbacks.last_page);
        setPerPage(feedbacks.per_page);
        setFilters({
            type: queryParams.filter_type ?? "",
            message: queryParams.filter_message ?? "",
            device: queryParams.filter_device ?? "",
            page: queryParams.filter_page ?? "",
            read_at: queryParams.filter_read_at ?? "all",
            created_at_start: utcIsoToLocalInput(queryParams.filter_created_at_start ?? ""),
            created_at_end: utcIsoToLocalInput(queryParams.filter_created_at_end ?? ""),
        });
    }, [feedbacks, queryParams]);

    function handleSort(column: string) {
        const newDirection: "asc" | "desc" = sort.column === column && sort.direction === "asc" ? "desc" : "asc";
        const newSort = { column, direction: newDirection };
        setSort(newSort);
        setCurrentPage(1);
        fetchFeedbacks(1, perPage, searchValue, newSort);
    }

    const [filters, setFilters] = useState({
        type: queryParams.filter_type ?? "",
        message: queryParams.filter_message ?? "",
        device: queryParams.filter_device ?? "",
        page: queryParams.filter_page ?? "",
        read_at: queryParams.filter_read_at ?? "all",
        created_at_start: queryParams.filter_created_at_start ?? "",
        created_at_end: queryParams.filter_created_at_end ?? "",
    });
    const [showFilters, setShowFilters] = useState(false);



    const applyFilters = () => {
        setCurrentPage(1);
        const filtersToSend = {
            type: filters.type,
            message: filters.message,
            device: filters.device,
            page: filters.page,
            read_at: filters.read_at === "all" ? "" : filters.read_at,
            created_at_start: localToUtcIso(filters.created_at_start) || "",
            created_at_end: localToUtcIso(filters.created_at_end) || "",
        };
        fetchFeedbacksWithFilters(1, perPage, searchValue, sort, filtersToSend);
    };

    const clearFilters = () => {
        const emptyFilters = { type: "", message: "", device: "", page: "", read_at: "all", created_at_start: "", created_at_end: "" };
        setFilters(emptyFilters);
        setCurrentPage(1);
        fetchFeedbacksWithFilters(1, perPage, searchValue, sort, { type: "", message: "", device: "", page: "", read_at: "", created_at_start: "", created_at_end: "" });
    };

    const fetchFeedbacksWithFilters = (
        page = 1,
        perPage = 10,
        search = "",
        sort = { column: "created_at", direction: "desc" as "asc" | "desc" },
        filters = { type: "", message: "", device: "", page: "", read_at: "", created_at_start: "", created_at_end: "" }
    ) => {
        router.get(route('feedbacks.index'), {
            page,
            per_page: perPage,
            search,
            sort_column: sort.column,
            sort_direction: sort.direction,
            filter_type: filters.type,
            filter_message: filters.message,
            filter_device: filters.device,
            filter_page: filters.page,
            filter_read_at: filters.read_at,
            filter_created_at_start: filters.created_at_start,
            filter_created_at_end: filters.created_at_end,
        }, {
            preserveState: true,
            replace: true
        });
    };

    const fetchFeedbacks = (page = 1, perPage = 10, search = "", sort = { column: "created_at", direction: "desc" as "asc" | "desc" }) => {
        const filtersToSend = {
            type: filters.type,
            message: filters.message,
            device: filters.device,
            page: filters.page,
            read_at: filters.read_at === "all" ? "" : filters.read_at,
            created_at_start: filters.created_at_start,
            created_at_end: filters.created_at_end,
        };
        fetchFeedbacksWithFilters(page, perPage, search, sort, filtersToSend);
    };

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        if (page !== feedbacks.current_page) {
            fetchFeedbacks(page, perPage, searchValue, sort);
        }
    };

    const onSearchSubmit = () => {
        fetchFeedbacks(1, perPage, searchValue, sort);
    };

    const onRowsPerPageChange = (rows: number) => {
        setPerPage(rows);
        setCurrentPage(1);
        if (rows !== feedbacks.per_page) {
            fetchFeedbacks(1, rows, searchValue, sort);
        }
    };

    const { feedbackTypes, loading: loadingTypes } = useFeedbackTypes();

    return (
        <AuthenticatedLayout header="Lista de Feedbacks">
            <Head title="Lista de Feedbacks" />
            <div className="flex flex-1 flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Lista de Feedbacks</h2>
                    <div className="flex items-center gap-2">
                        <Popover open={showFilters} onOpenChange={setShowFilters}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`${(filters.type || filters.message || filters.device || filters.page || (filters.read_at && filters.read_at !== "all") || filters.created_at_start || filters.created_at_end) ? 'border-blue-500 bg-blue-50' : ''}`}
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtros
                                    {(filters.type || filters.message || filters.device || filters.page || (filters.read_at && filters.read_at !== "all") || filters.created_at_start || filters.created_at_end) && (
                                        <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                            {[filters.type, filters.message, filters.device, filters.page, filters.read_at !== "all" ? filters.read_at : null, filters.created_at_start, filters.created_at_end].filter(Boolean).length}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Filtros Avançados</h4>
                                        {(filters.type || filters.message || filters.device || filters.page || (filters.read_at && filters.read_at !== "all") || filters.created_at_start || filters.created_at_end) && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearFilters}
                                                className="h-auto p-1 text-muted-foreground hover:text-foreground"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <Label htmlFor="filter-type" className="text-sm font-medium">
                                                Tipo
                                            </Label>
                                            <Select
                                                value={filters.type || "all"}
                                                onValueChange={value => setFilters(prev => ({ ...prev, type: value === "all" ? "" : value }))}
                                                disabled={loadingTypes}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder={loadingTypes ? "Carregando..." : "Filtrar por tipo..."} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todos</SelectItem>
                                                    {feedbackTypes.map(type => (
                                                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="filter-message" className="text-sm font-medium">
                                                Mensagem
                                            </Label>
                                            <Input
                                                id="filter-message"
                                                placeholder="Filtrar por mensagem..."
                                                value={filters.message}
                                                onChange={(e) => setFilters(prev => ({ ...prev, message: e.target.value }))}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="filter-device" className="text-sm font-medium">
                                                Dispositivo
                                            </Label>
                                            <Input
                                                id="filter-device"
                                                placeholder="Filtrar por dispositivo..."
                                                value={filters.device}
                                                onChange={(e) => setFilters(prev => ({ ...prev, device: e.target.value }))}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="filter-page" className="text-sm font-medium">
                                                Página
                                            </Label>
                                            <Input
                                                id="filter-page"
                                                placeholder="Filtrar por página..."
                                                value={filters.page}
                                                onChange={(e) => setFilters(prev => ({ ...prev, page: e.target.value }))}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="filter-read-at" className="text-sm font-medium">
                                                Lido
                                            </Label>
                                            <Select
                                                value={filters.read_at}
                                                onValueChange={(value) => setFilters(prev => ({ ...prev, read_at: value }))}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Selecionar status..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todos</SelectItem>
                                                    <SelectItem value="read">Lido</SelectItem>
                                                    <SelectItem value="unread">Não lido</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex flex-col gap-2 mt-4">
                                            <div>
                                                <Label htmlFor="filter-created-at-start-dt" className="text-sm font-medium">Data/Hora Inicial</Label>
                                                <DateTimePicker
                                                    value={filters.created_at_start}
                                                    onChange={(date: string | null) => setFilters(prev => ({ ...prev, created_at_start: date }))}
                                                    placeholder="Data/hora inicial"
                                                    max={filters.created_at_end || undefined}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="filter-created-at-end-dt" className="text-sm font-medium">Data/Hora Final</Label>
                                                <DateTimePicker
                                                    value={filters.created_at_end}
                                                    onChange={(date: string | null) => setFilters(prev => ({ ...prev, created_at_end: date }))}
                                                    placeholder="Data/hora final"
                                                    min={filters.created_at_start || undefined}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button onClick={applyFilters} size="sm" className="flex-1">Aplicar Filtros</Button>
                                        <Button variant="outline" onClick={() => setShowFilters(false)} size="sm">Fechar</Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DataTable
                    data={feedbackData}
                    columns={columns}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    rowsPerPage={perPage}
                    searchValue={searchValue}
                    onSearchCharge={setSearchValue}
                    searchPlaceholder="Pesquisar por mensagem..."
                    onSearchSubmit={onSearchSubmit}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            </div>
        </AuthenticatedLayout>
    );
}
// --- FIM NOVA TELA DE FEEDBACKS ---
