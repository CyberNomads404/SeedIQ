import { useEffect, useState } from "react";
import { z } from "zod";
import { Head, router, Link } from "@inertiajs/react";
import { MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from "lucide-react";

import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
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
import { RoleFormDialog } from "@/components/forms/form-role";

import { useHasAnyPermission, useHasPermission } from "@/utils/permissions";
import { IRole, IRoleProps } from "@/interfaces/IRole";
import { roleFormSchema } from "@/schemas/form-role-schema";

const getColumns = (
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
            accessorKey: "hierarchy_level",
            header: ({ column }) => {
                const isSorted = sort.column === "hierarchy_level";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort("hierarchy_level")}
                    >
                        Nível
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
                    <span className="text-sm text-muted-foreground">Nível {row.original.hierarchy_level}</span>
                </div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const role = row.original;

                const [isOpenAlertDelete, setIsOpenAlertDelete] = useState<boolean>(false);
                const onAlertDelete = () => setIsOpenAlertDelete(!isOpenAlertDelete);

                const [isOpenUpdatePermissionForm, setIsOpenUpdatePermissionForm] = useState<boolean>(false);
                const onUpdatePermission = () => setIsOpenUpdatePermissionForm(!isOpenUpdatePermissionForm);

                const handleUpdate = (values: z.infer<typeof roleFormSchema>, id?: number) => {
                    router.put(route('roles.update', id), values, {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: () => {
                            onUpdatePermission();
                        },
                    });
                };

                const handleDelete = (id: number) => {
                    router.delete(route('roles.destroy', id), {
                        preserveState: true,
                        preserveScroll: true,
                    });
                };

                return (
                    <>
                        {useHasAnyPermission(['roles_list', 'roles_edit', 'roles_delete']) && (
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
                                        {useHasPermission("roles_list") && (
                                            <Link href={route('roles.show', role.id)}>
                                                <DropdownMenuItem>
                                                    Visualizar
                                                </DropdownMenuItem>
                                            </Link>
                                        )}
                                        {useHasPermission("roles_edit") && (
                                            <DropdownMenuItem onClick={onUpdatePermission}>
                                                Atualizar
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuSeparator />
                                        {useHasPermission("roles_delete") && (
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
                                                Esta ação não pode ser desfeita. Isso excluirá permanentemente esse perfil do sistema.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel onClick={onAlertDelete}>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => { handleDelete(role.id); onAlertDelete() }} className="bg-red-500 hover:bg-red-900">
                                                Continuar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                {/* Formulário de Atualizar Permissão */}
                                <RoleFormDialog
                                    data={role}
                                    id={role.id}
                                    isOpen={isOpenUpdatePermissionForm}
                                    setIsOpen={setIsOpenUpdatePermissionForm}
                                    onSubmit={handleUpdate}
                                />
                            </div>
                        )}
                    </>
                );
            },
        },
    ];


export default function Index({ roles, queryParams }: IRoleProps) {
    const [roleData, setRoleData] = useState<IRole[]>(roles.data);
    const [currentPage, setCurrentPage] = useState(roles.current_page);
    const [lastPage, setLastPage] = useState(roles.last_page);
    const [perPage, setPerPage] = useState(roles.per_page);
    const [searchValue, setSearchValue] = useState(queryParams.search ?? "");
    const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" }>({
        column: queryParams.sort_column ?? "hierarchy_level",
        direction: queryParams.sort_direction ?? "asc"
    });

    const [filters, setFilters] = useState({
        name: queryParams.filter_name ?? "",
        hierarchy: queryParams.filter_hierarchy ? queryParams.filter_hierarchy : "all",
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleSort = (column: string) => {
        const newDirection: "asc" | "desc" = sort.column === column && sort.direction === "asc" ? "desc" : "asc";
        const newSort = { column, direction: newDirection };
        setSort(newSort);
        setCurrentPage(1);
        const filtersToSend = {
            name: filters.name,
            hierarchy: filters.hierarchy === "all" ? "" : filters.hierarchy
        };
        fetchRoles(1, perPage, searchValue, newSort, filtersToSend);
    };

    const [columns, setColumns] = useState(getColumns(sort, handleSort));

    const applyFilters = () => {
        setCurrentPage(1);
        const filtersToSend = {
            name: filters.name,
            hierarchy: filters.hierarchy === "all" ? "" : filters.hierarchy
        };
        fetchRoles(1, perPage, searchValue, sort, filtersToSend);
    };

    const clearFilters = () => {
        const emptyFilters = { name: "", hierarchy: "all" };
        setFilters(emptyFilters);
        setCurrentPage(1);
        fetchRoles(1, perPage, searchValue, sort, { name: "", hierarchy: "" });
    };

    const fetchRoles = (
        page = 1,
        perPage = 10,
        search = "",
        sort = { column: "name", direction: "asc" as "asc" | "desc" },
        filters = { name: "", hierarchy: "" }
    ) => {
        router.get(route('roles.index'), {
            page,
            per_page: perPage,
            search,
            sort_column: sort.column,
            sort_direction: sort.direction,
            filter_name: filters.name,
            filter_hierarchy: filters.hierarchy,
        }, {
            preserveState: true,
            replace: true
        });
    };

    useEffect(() => {
        setRoleData(roles.data);
        setColumns(getColumns(sort, handleSort));
        setCurrentPage(roles.current_page);
        setLastPage(roles.last_page);
        setPerPage(roles.per_page);

        if (queryParams.sort_column && queryParams.sort_direction) {
            setSort({
                column: queryParams.sort_column,
                direction: queryParams.sort_direction as "asc" | "desc"
            });
        }

        setFilters({
            name: queryParams.filter_name ?? "",
            hierarchy: queryParams.filter_hierarchy ? queryParams.filter_hierarchy : "all",
        });
    }, [roles, queryParams]);

    useEffect(() => {
        if (roleData.length === 0 && currentPage > 1) {
            const filtersToSend = {
                name: filters.name,
                hierarchy: filters.hierarchy === "all" ? "" : filters.hierarchy
            };
            fetchRoles(currentPage - 1, perPage, searchValue, sort, filtersToSend);
        }
    }, [roleData]);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        if (page != roles.current_page) {
            const filtersToSend = {
                name: filters.name,
                hierarchy: filters.hierarchy === "all" ? "" : filters.hierarchy
            };
            fetchRoles(page, perPage, searchValue, sort, filtersToSend);
        }
    };

    const onSearchSubmit = () => {
        setCurrentPage(1);
        const filtersToSend = {
            name: filters.name,
            hierarchy: filters.hierarchy === "all" ? "" : filters.hierarchy
        };
        fetchRoles(1, perPage, searchValue, sort, filtersToSend);
    }

    const onRowsPerPageChange = (rows: number) => {
        setPerPage(rows);
        setCurrentPage(1);
        if (rows != roles.per_page) {
            const filtersToSend = {
                name: filters.name,
                hierarchy: filters.hierarchy === "all" ? "" : filters.hierarchy
            };
            fetchRoles(1, rows, searchValue, sort, filtersToSend);
        }
    };

    const [isOpenAddPermissionForm, setIsOpenAddPermissionForm] = useState<boolean>(false);
    const onAddPermission = () => setIsOpenAddPermissionForm(!isOpenAddPermissionForm);

    const handleSubmit = (values: z.infer<typeof roleFormSchema>) => {
        router.post(route('roles.store'), values, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onAddPermission();
            },
        });
    };

    return (
        <AuthenticatedLayout header="Lista de Perfis">
            <Head title="Lista de Perfis" />
            <div className="flex flex-1 flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Lista de Perfis</h2>

                    {/* Controles de Filtro */}
                    <div className="flex items-center gap-2">
                        <Popover open={showFilters} onOpenChange={setShowFilters}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`${(filters.name || (filters.hierarchy && filters.hierarchy !== "all")) ? 'border-blue-500 bg-blue-50' : ''}`}
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtros
                                    {(filters.name || (filters.hierarchy && filters.hierarchy !== "all")) && (
                                        <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                            {[filters.name, filters.hierarchy !== "all" ? filters.hierarchy : null].filter(Boolean).length}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Filtros Avançados</h4>
                                        {(filters.name || (filters.hierarchy && filters.hierarchy !== "all")) && (
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
                                                Nome do Perfil
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
                                            <Label htmlFor="filter-hierarchy" className="text-sm font-medium">
                                                Nível de Hierarquia
                                            </Label>
                                            <Input
                                                id="filter-hierarchy"
                                                type="number"
                                                min="1"
                                                max="10"
                                                placeholder="Digite o nível (ex: 1, 2, 3...)"
                                                value={filters.hierarchy === "all" ? "" : filters.hierarchy}
                                                onChange={(e) => setFilters(prev => ({
                                                    ...prev,
                                                    hierarchy: e.target.value === "" ? "all" : e.target.value
                                                }))}
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
                    data={roleData}
                    columns={columns}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    rowsPerPage={perPage}
                    searchValue={searchValue}
                    onSearchCharge={setSearchValue}
                    searchPlaceholder="Pesquisar por nome da perfil..."
                    onSearchSubmit={onSearchSubmit}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    onAdd={onAddPermission}
                    permissions={{
                        "create": "roles_create",
                    }}
                />
            </div>

            {/* Formulário de Adicionar Permissão */}
            <RoleFormDialog
                isOpen={isOpenAddPermissionForm}
                setIsOpen={setIsOpenAddPermissionForm}
                onSubmit={handleSubmit}
            />
        </AuthenticatedLayout>
    );
}
