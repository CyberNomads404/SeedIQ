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
import { CategoryFormDialog } from "@/components/forms/form-category";

import { ICategory, ICategoryProps } from "@/interfaces/ICategory";
import { categoryFormSchema } from "@/schemas/form-category-schema";
import { useHasAnyPermission, useHasPermission } from "@/utils/permissions";
import { IRoleForCreateOptions } from "@/interfaces/ISelect";

import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// @ts-ignore
const route = (window as any).route;

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
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const category = row.original;

            const [isOpenAlertDelete, setIsOpenAlertDelete] = useState<boolean>(false);
            const onAlertDelete = () => setIsOpenAlertDelete(!isOpenAlertDelete);

            const [isOpenUpdateForm, setIsOpenUpdateForm] = useState<boolean>(false);
            const onUpdate = () => setIsOpenUpdateForm(!isOpenUpdateForm);

            const handleUpdate = (values: z.infer<typeof categoryFormSchema>, external_id?: string) => {
                router.put(route('categories.update', external_id), values, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        onUpdate();
                    },
                    onError: (errors) => {
                        console.error(errors);
                    },
                });
            };

            const handleDelete = (external_id: string) => {
                router.delete(route('categories.destroy', external_id), {
                    preserveState: true,
                    preserveScroll: true,
                });
            };

            return (
                <>
                    {useHasAnyPermission(['categories_edit', 'categories_delete']) && (
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
                                    {useHasPermission("categories_edit") && (
                                        <DropdownMenuItem onClick={onUpdate}>
                                            Atualizar
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    {useHasPermission("categories_delete") && (
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
                                            Esta ação não pode ser desfeita. Isso excluirá permanentemente esse categoria do sistema.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={onAlertDelete}>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => { handleDelete(category.external_id); onAlertDelete() }} className="bg-red-500 hover:bg-red-900">
                                            Continuar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <CategoryFormDialog
                                data={category}
                                external_id={category.external_id}
                                isOpen={isOpenUpdateForm}
                                setIsOpen={setIsOpenUpdateForm}
                                onSubmit={handleUpdate}
                            />
                        </div>
                    )}
                </>
            );
        },
    },
];


export default function Index({ categories, query_params }: ICategoryProps) {
    const [categoryData, setCategoryData] = useState<ICategory[]>(categories.data);
    const [currentPage, setCurrentPage] = useState(categories.current_page);
    const [lastPage, setLastPage] = useState(categories.last_page);
    const [perPage, setPerPage] = useState(categories.per_page);
    const [searchValue, setSearchValue] = useState(query_params.search ?? "");
    const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" }>({
        column: query_params.sort_column ?? "name",
        direction: query_params.sort_direction ?? "asc"
    });

    // Filtros
    const [filters, setFilters] = useState({
        name: query_params.filter_name ?? "",
        parent: query_params.filter_parent ?? "",
        icon: query_params.filter_icon ?? "",
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
        setCategoryData(categories.data);
        setColumns(getColumns(sort, handleSort));
        setCurrentPage(categories.current_page);
        setLastPage(categories.last_page);
        setPerPage(categories.per_page);
        setFilters({
            name: query_params.filter_name ?? "",
            parent: query_params.filter_parent ?? "",
            icon: query_params.filter_icon ?? "",
        });
        if (query_params.sort_column && query_params.sort_direction) {
            setSort({
                column: query_params.sort_column,
                direction: query_params.sort_direction as "asc" | "desc"
            });
        }
    }, [categories, query_params]);

    useEffect(() => {
        if (categoryData.length === 0 && currentPage > 1) {
            fetchCategories(currentPage - 1, perPage, searchValue, sort);
        }
    }, [categoryData]);

    const fetchCategoriesWithFilters = (
        page = 1,
        perPage = 10,
        search = "",
        sort = { column: "name", direction: "asc" as "asc" | "desc" },
        filters = { name: "", parent: "", icon: "" }
    ) => {
        router.get(route('categories.index'), {
            page,
            per_page: perPage,
            search,
            sort_column: sort.column,
            sort_direction: sort.direction,
            filter_name: filters.name,
            filter_parent: filters.parent,
            filter_icon: filters.icon,
        }, {
            preserveState: true,
            replace: true
        });
    };

    const fetchCategories = (page = 1, perPage = 10, search = "", sort = { column: "name", direction: "asc" as "asc" | "desc" }) => {
        const filtersToSend = {
            name: filters.name,
            parent: filters.parent,
            icon: filters.icon,
        };
        fetchCategoriesWithFilters(page, perPage, search, sort, filtersToSend);
    };

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        if (page != categories.current_page) {
            fetchCategories(page, perPage, searchValue, sort);
        }
    };

    const onSearchSubmit = () => {
        fetchCategories(1, perPage, searchValue, sort);
    };

    const onRowsPerPageChange = (rows: number) => {
        setPerPage(rows);
        setCurrentPage(1);
        if (rows != categories.per_page) {
            fetchCategories(1, rows, searchValue, sort);
        }
    };

    const applyFilters = () => {
        setCurrentPage(1);
        fetchCategoriesWithFilters(1, perPage, searchValue, sort, filters);
    };

    const clearFilters = () => {
        const emptyFilters = { name: "", parent: "", icon: "" };
        setFilters(emptyFilters);
        setCurrentPage(1);
        fetchCategoriesWithFilters(1, perPage, searchValue, sort, emptyFilters);
    };

    const [isOpenAddCategoryForm, setIsOpenAddCategoryForm] = useState<boolean>(false);
    const onAddCategory = () => setIsOpenAddCategoryForm(!isOpenAddCategoryForm);

    const handleSubmit = (values: z.infer<typeof categoryFormSchema>) => {
        router.post(route('categories.store'), values, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onAddCategory();
            },
        });
    };

    return (
        <AuthenticatedLayout header="Lista de Categorias">
            <Head title="Lista de Categorias" />
            <div className="flex flex-1 flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Lista de Categorias</h2>

                    {/* Controles de Filtro - igual ao de empresa */}
                    <div className="flex items-center gap-2">
                        <Popover open={showFilters} onOpenChange={setShowFilters}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`${(filters.name || filters.icon || filters.parent) ? 'border-blue-500 bg-blue-50' : ''}`}
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtros
                                    {(filters.name || filters.icon || filters.parent) && (
                                        <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                            {[filters.name, filters.icon, filters.parent].filter(Boolean).length}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Filtros Avançados</h4>
                                        {(filters.name || filters.icon || filters.parent) && (
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
                                                Nome da Categoria
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
                                            <Label htmlFor="filter-icon" className="text-sm font-medium">
                                                Ícone
                                            </Label>
                                            <Input
                                                id="filter-icon"
                                                placeholder="Filtrar por ícone..."
                                                value={filters.icon}
                                                onChange={(e) => setFilters(prev => ({ ...prev, icon: e.target.value }))}
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
                    data={categoryData}
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
                    onAdd={onAddCategory}
                    permissions={{
                        create: "categories_create",
                    }}
                />
            </div>

            {/* Formulário de Adicionar Permissão */}
            <CategoryFormDialog
                isOpen={isOpenAddCategoryForm}
                setIsOpen={setIsOpenAddCategoryForm}
                onSubmit={handleSubmit}
            />
        </AuthenticatedLayout>
    );
}
