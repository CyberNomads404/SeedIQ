import { useEffect, useState } from "react";
import { z } from "zod";
import { Head, router } from "@inertiajs/react";
import { MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/data-table";
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { RoleIdFormDialog } from "@/components/forms/form-role-id";

import { useHasAnyPermission, useHasPermission } from "@/utils/permissions";
import { IRole, IRoleIdProps } from "@/interfaces/IRole";
import { IPermission } from "@/interfaces/IPermission";
import { roleIdFormSchema } from "@/schemas/form-role-id-schema";

const getColumns = (
    role: IRole,
    sort: { column: string; direction: "asc" | "desc" },
    onSort: (column: string) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "name",
            header: ({ column }) => {
                const isSorted = sort.column === "name";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort("name")}
                    >
                        Nome
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
                <div className="flex items-center gap-2">
                    <span className="font-medium">{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "title",
            header: ({ column }) => {
                const isSorted = sort.column === "title";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort("title")}
                    >
                        Título
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
                <div className="flex items-center gap-2">
                    <span>{row.original.title}</span>
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const permission = row.original;
                const [isOpenAlertDelete, setIsOpenAlertDelete] = useState<boolean>(false);
                const onAlertDelete = () => setIsOpenAlertDelete((v) => !v);

                const handleDelete = (id: number, permission_id: number) => {
                    router.delete(route('roles.detachPermission', { id, permission_id }), {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: () => setIsOpenAlertDelete(false),
                    });
                };

                return (
                    <>
                        {useHasAnyPermission(['roles_edit']) && (
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
                                        <DropdownMenuSeparator />
                                        {useHasPermission("roles_edit") && (
                                            <DropdownMenuItem onClick={onAlertDelete} className="text-red-600">
                                                Deletar
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <AlertDialog open={isOpenAlertDelete}>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta ação não pode ser desfeita. Isso excluirá permanentemente esse permissão desse perfil.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={onAlertDelete}>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(role.id, permission.id)} className="bg-red-500 hover:bg-red-900">
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

export default function Index({ permissions, role, permissions_select, queryParams }: IRoleIdProps) {
    const [permissionData, setRoleData] = useState<IPermission[]>(permissions.data);
    const [currentPage, setCurrentPage] = useState(permissions.current_page);
    const [lastPage, setLastPage] = useState(permissions.last_page);
    const [perPage, setPerPage] = useState(permissions.per_page);
    const [searchValue, setSearchValue] = useState(queryParams.search ?? "");
    const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" }>({
        column: queryParams.sort_column ?? "title",
        direction: queryParams.sort_direction ?? "asc"
    });

    const [filters, setFilters] = useState({
        name: queryParams.filter_name ?? "",
        title: queryParams.filter_title ?? "",
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleSort = (column: string) => {
        const newDirection: "asc" | "desc" = sort.column === column && sort.direction === "asc" ? "desc" : "asc";
        const newSort = { column, direction: newDirection };
        setSort(newSort);
        setCurrentPage(1);
        fetchPermissions(1, perPage, searchValue, newSort, filters);
    };

    const [columns, setColumns] = useState(getColumns(role, sort, handleSort));

    const applyFilters = () => {
        setCurrentPage(1);
        fetchPermissions(1, perPage, searchValue, sort, filters);
    };

    const clearFilters = () => {
        const emptyFilters = { name: "", title: "" };
        setFilters(emptyFilters);
        setCurrentPage(1);
        fetchPermissions(1, perPage, searchValue, sort, emptyFilters);
    };

    useEffect(() => {
        setRoleData(permissions.data);
        setColumns(getColumns(role, sort, handleSort));
        setCurrentPage(permissions.current_page);
        setLastPage(permissions.last_page);
        setPerPage(permissions.per_page);

        if (queryParams.sort_column && queryParams.sort_direction) {
            setSort({
                column: queryParams.sort_column,
                direction: queryParams.sort_direction as "asc" | "desc"
            });
        }

        setFilters({
            name: queryParams.filter_name ?? "",
            title: queryParams.filter_title ?? "",
        });
    }, [permissions, queryParams]);

    useEffect(() => {
        if (permissionData.length === 0 && currentPage > 1) {
            fetchPermissions(currentPage - 1, perPage, searchValue, sort, filters);
        }
    }, [permissionData]);

    const fetchPermissions = (
        page = 1,
        perPage = 10,
        search = "",
        sort = { column: "title", direction: "asc" as "asc" | "desc" },
        filters = { name: "", title: "" }
    ) => {
        router.get(route('roles.show', {
            id: role.id,
            page,
            per_page: perPage,
            search,
            sort_column: sort.column,
            sort_direction: sort.direction,
            filter_name: filters.name,
            filter_title: filters.title,
        }), {
            preserveState: true,
            replace: true
        });
    };

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        if (page != permissions.current_page) {
            fetchPermissions(page, perPage, searchValue, sort, filters);
        }
    };

    const onSearchSubmit = () => {
        setCurrentPage(1);
        fetchPermissions(1, perPage, searchValue, sort, filters);
    }

    const onRowsPerPageChange = (rows: number) => {
        setPerPage(rows);
        setCurrentPage(1);
        if (rows != permissions.per_page) {
            fetchPermissions(1, rows, searchValue, sort, filters);
        }
    };

    const [isOpenAddPermissionForm, setIsOpenAddPermissionForm] = useState<boolean>(false);
    const onAddPermission = () => setIsOpenAddPermissionForm(!isOpenAddPermissionForm);

    const handleSubmit = (values: z.infer<typeof roleIdFormSchema>, role: IRole) => {
        console.log(values);
        router.post(route('roles.attachPermissions', role.id), values, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onAddPermission();
            },
        });
    };

    return (
        <AuthenticatedLayout header="Lista de Permissões do Perfil">
            <Head title="Lista de Permissões do Perfil" />
            <div className="flex flex-1 flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Lista de Permissões de {role.name}</h2>

                    {/* Controles de Filtro */}
                    <div className="flex items-center gap-2">
                        <Popover open={showFilters} onOpenChange={setShowFilters}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`${(filters.name || filters.title) ? 'border-blue-500 bg-blue-50' : ''}`}
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtros
                                    {(filters.name || filters.title) && (
                                        <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                            {[filters.name, filters.title].filter(Boolean).length}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Filtros Avançados</h4>
                                        {(filters.name || filters.title) && (
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
                                            <Label htmlFor="filter-name" className="text-sm font-medium">
                                                Nome da Permissão
                                            </Label>
                                            <Input
                                                id="filter-name"
                                                placeholder="Filtrar por nome..."
                                                value={filters.name}
                                                onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="filter-title" className="text-sm font-medium">
                                                Título da Permissão
                                            </Label>
                                            <Input
                                                id="filter-title"
                                                placeholder="Filtrar por título..."
                                                value={filters.title}
                                                onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
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
                    data={permissionData}
                    columns={columns}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    rowsPerPage={perPage}
                    searchValue={searchValue}
                    onSearchCharge={setSearchValue}
                    searchPlaceholder="Pesquisar por nome da permissão..."
                    onSearchSubmit={onSearchSubmit}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    onAdd={onAddPermission}
                    permissions={{
                        "create": "roles_edit",
                    }}
                />
            </div>

            {/* Formulário de Adicionar Permissão */}
            <RoleIdFormDialog
                isOpen={isOpenAddPermissionForm}
                setIsOpen={setIsOpenAddPermissionForm}
                onSubmit={handleSubmit}
                role={role}
                permissions_select={permissions_select}
            />
        </AuthenticatedLayout>
    );
}
