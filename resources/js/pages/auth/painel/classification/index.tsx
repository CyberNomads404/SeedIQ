import React, { useEffect, useState } from "react";
import { z } from "zod";
import { Head, Link, router } from "@inertiajs/react";
import { MoreHorizontal, Slash } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Filter, X } from "lucide-react";
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
import { IClassification, IClassificationProps } from "@/interfaces/IClassification";
import { useHasAnyPermission, useHasPermission } from "@/utils/permissions";

import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ISelectData } from "@/interfaces/IRole";

// @ts-ignore
const route = (window as any).route;

const getColumns = (
    sort: { column: string; direction: "asc" | "desc" },
    onSort: (column: string) => void
): ColumnDef<any>[] => [
    {
        accessorKey: "status",
        header: ({ column }) => {
            const isSorted = sort.column === "status";
            return (
                <Button
                    variant="ghost"
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                    onClick={() => onSort("status")}
                >
                    Status
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
            const classification = row.original;
            const statusColorMap: Record<string, string> = {
                registered: 'bg-gray-100 text-gray-800',
                in_progress: 'bg-yellow-100 text-yellow-800',
                completed: 'bg-green-100 text-green-800',
                failed: 'bg-red-100 text-red-800',
                canceled: 'bg-gray-200 text-gray-800',
            };

            const colorClass = statusColorMap[classification.status] ?? 'bg-gray-100 text-gray-800';

            return (
                <span className={`px-2 py-0.5 rounded text-sm ${colorClass}`}>
                    {classification.status_label ?? classification.status}
                </span>
            );
        }
    },
    {
        accessorKey: "file_url",
        header: () => <span className="font-semibold">Imagem</span>,
        cell: ({ row }) => {
            const classification = row.original;
            return classification.file_url ? (
                <img src={classification.file_url} alt={classification.name} className="w-12 h-8 object-cover rounded" />
            ) : (
                <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                    Sem imagem
                </div>
            );
        }
    },
    {
        accessorKey: "message",
        header: () => <span className="font-semibold">Mensagem</span>,
        cell: ({ row }) => {
            const classification = row.original;
            return <span className="text-sm text-foreground/90">{classification.message ?? '-'}</span>;
        }
    },
    {
        id: "category",
        accessorFn: (row) => row.category_for_display?.name ?? '-',
        header: ({ column }) => {
            const isSorted = sort.column === "category";
            return (
                <span className="font-semibold">Categoria</span>
            );
        },
        cell: ({ row }) => {
            const classification = row.original;
            return (
                <div className="flex items-center gap-2">
                    <span className="text-sm">{classification.category_for_display?.name ?? '-'}</span>
                </div>
            );
        }
    },
    {
        id: "user",
        accessorFn: (row) => row.user_for_display?.name ?? '-',
        header: ({ column }) => {
            const isSorted = sort.column === "user";
            return (
                <span className="font-semibold">Usuário</span>
            );
        },
        cell: ({ row }) => {
            const classification = row.original;
            const user = classification.user_for_display;
            return user ? (
                <Link href={route('users.show', user.external_id)} className="text-sm text-blue-600 hover:underline">
                    {user.name}
                </Link>
            ) : (
                <span className="text-sm">-</span>
            );
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const classification = row.original;

            const [isOpenAlertDelete, setIsOpenAlertDelete] = useState<boolean>(false);
            const onAlertDelete = () => setIsOpenAlertDelete(!isOpenAlertDelete);

            const handleDelete = (external_id: string) => {
                router.delete(route('classifications.destroy', external_id), {
                    preserveState: true,
                    preserveScroll: true,
                });
            };

            return (
                <>
                    {useHasAnyPermission(['classifications_list', 'classifications_delete']) && (
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
                                    {useHasPermission("classifications_list") && (
                                        <Link href={route('classifications.show', classification.external_id)} className="no-underline">
                                            <DropdownMenuItem>
                                                Ver Detalhes
                                            </DropdownMenuItem>
                                        </Link>
                                    )}
                                    <DropdownMenuSeparator />
                                    {useHasPermission("classifications_delete") && (
                                        <DropdownMenuItem onClick={onAlertDelete}>
                                            Deletar
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Alerta ao deletar */}
                            <AlertDialog open={isOpenAlertDelete}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta ação não pode ser desfeita. Isso excluirá permanentemente esse registro do sistema.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={onAlertDelete}>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => { handleDelete(classification.external_id); onAlertDelete() }} className="bg-red-500 hover:bg-red-900">
                                            Continuar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </>
            );
        },
    },
];


export default function Index({ classifications, query_params, status_types }: IClassificationProps) {
    const [classificationData, setClassificationData] = useState<IClassification[]>(classifications.data);
    const statusTypes: ISelectData[] = status_types ?? [];
    const [currentPage, setCurrentPage] = useState(classifications.current_page);
    const [lastPage, setLastPage] = useState(classifications.last_page);
    const [perPage, setPerPage] = useState(classifications.per_page);
    const [searchValue, setSearchValue] = useState(query_params.search ?? "");
    const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" }>({
        column: query_params.sort_column ?? "name",
        direction: query_params.sort_direction ?? "asc"
    });

    console.log(statusTypes);

    // Filtros
    const [filters, setFilters] = useState({
        status: query_params.filter_status ?? "",
        category: query_params.filter_category ?? "",
        user: query_params.filter_user ?? "",
        message: query_params.filter_message ?? "",
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleSort = (column: string) => {
        const newDirection: "asc" | "desc" = sort.column === column && sort.direction === "asc" ? "desc" : "asc";
        const newSort = { column, direction: newDirection };
        setSort(newSort);
        setCurrentPage(1);
        fetchCategories(1, perPage, searchValue, newSort);
    };

    const [columns, setColumns] = useState(getColumns(sort, handleSort));

    useEffect(() => {
        setClassificationData(classifications.data);
        setColumns(getColumns(sort, handleSort));
        setCurrentPage(classifications.current_page);
        setLastPage(classifications.last_page);
        setPerPage(classifications.per_page);
        setFilters({
            status: query_params.filter_status ?? "",
            category: query_params.filter_category ?? "",
            user: query_params.filter_user ?? "",
            message: query_params.filter_message ?? "",
        });
        if (query_params.sort_column && query_params.sort_direction) {
            setSort({
                column: query_params.sort_column,
                direction: query_params.sort_direction as "asc" | "desc"
            });
        }
    }, [classifications, query_params]);

    useEffect(() => {
        if (classificationData.length === 0 && currentPage > 1) {
            fetchCategories(currentPage - 1, perPage, searchValue, sort);
        }
    }, [classificationData]);

    const fetchCategoriesWithFilters = (
        page = 1,
        perPage = 10,
        search = "",
        sort = { column: "name", direction: "asc" as "asc" | "desc" },
        filters = { status: "", category: "", user: "", message: "" }
    ) => {
        router.get(route('classifications.index'), {
            page,
            per_page: perPage,
            search,
            sort_column: sort.column,
            sort_direction: sort.direction,
            filter_status: filters.status,
            filter_category: filters.category,
            filter_user: filters.user,
            filter_message: filters.message,
        }, {
            preserveState: true,
            replace: true
        });
    };

    const fetchCategories = (page = 1, perPage = 10, search = "", sort = { column: "name", direction: "asc" as "asc" | "desc" }) => {
        const filtersToSend = {
            status: filters.status,
            category: filters.category,
            user: filters.user,
            message: filters.message,
        };
        fetchCategoriesWithFilters(page, perPage, search, sort, filtersToSend);
    };

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        if (page != classifications.current_page) {
            fetchCategories(page, perPage, searchValue, sort);
        }
    };

    const onSearchSubmit = () => {
        fetchCategories(1, perPage, searchValue, sort);
    };

    const onRowsPerPageChange = (rows: number) => {
        setPerPage(rows);
        setCurrentPage(1);
        if (rows != classifications.per_page) {
            fetchCategories(1, rows, searchValue, sort);
        }
    };

    const applyFilters = () => {
        setCurrentPage(1);
        fetchCategoriesWithFilters(1, perPage, searchValue, sort, filters);
    };

    const clearFilters = () => {
        const emptyFilters = { status: "", category: "", user: "", message: "" };
        setFilters(emptyFilters);
        setCurrentPage(1);
        fetchCategoriesWithFilters(1, perPage, searchValue, sort, emptyFilters);
    };

    return (
        <AuthenticatedLayout header="Lista de Categorias">
            <Head title="Lista de Classificações" />
            <div className="flex flex-1 flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Lista de Classificações</h2>

                    {/* Controles de Filtro - igual ao de empresa */}
                    <div className="flex items-center gap-2">
                        <Popover open={showFilters} onOpenChange={setShowFilters}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`${(filters.status || filters.category || filters.user || filters.message) ? 'border-blue-500 bg-blue-50' : ''}`}
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtros
                                    {(filters.status || filters.category || filters.user || filters.message) && (
                                        <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                            {[filters.status, filters.category, filters.user, filters.message].filter(Boolean).length}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Filtros Avançados</h4>
                                        {(filters.status || filters.category || filters.user || filters.message) && (
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
                                            <Label htmlFor="filter-status" className="text-sm font-medium">Status</Label>
                                            <Select
                                                onValueChange={(val: string) => setFilters(prev => ({ ...prev, status: val === '__all' ? '' : val }))}
                                                value={filters.status === '' ? '__all' : filters.status}
                                            >
                                                <SelectTrigger id="filter-status" className="mt-1">
                                                    <SelectValue placeholder="Todos" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="__all">Todos</SelectItem>
                                                    {statusTypes.map((st) => (
                                                        <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="filter-category" className="text-sm font-medium">Categoria</Label>
                                            <Input
                                                id="filter-category"
                                                placeholder="Filtrar por categoria..."
                                                value={filters.category}
                                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="filter-user" className="text-sm font-medium">Usuário</Label>
                                            <Input
                                                id="filter-user"
                                                placeholder="Filtrar por usuário..."
                                                value={filters.user}
                                                onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="filter-message" className="text-sm font-medium">Mensagem</Label>
                                            <Input
                                                id="filter-message"
                                                placeholder="Filtrar por mensagem..."
                                                value={filters.message}
                                                onChange={(e) => setFilters(prev => ({ ...prev, message: e.target.value }))}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            onClick={applyFilters}
                                            size="sm"
                                            className="flex-1"
                                        >
                                            Aplicar Filtros
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowFilters(false)}
                                            size="sm"
                                        >
                                            Fechar
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <DataTable
                    data={classificationData}
                    columns={columns}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    rowsPerPage={perPage}
                    searchValue={searchValue}
                    onSearchCharge={setSearchValue}
                    searchPlaceholder="Pesquisar por nome da categoria..."
                    onSearchSubmit={onSearchSubmit}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            </div>
        </AuthenticatedLayout>
    );
}
