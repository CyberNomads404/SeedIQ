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
import { formatLocalDateTime } from "@/utils/dateTimeUtcLocal";
import { localToUtcIso } from "@/utils/dateTimeUtcLocal";
import { DateTimePicker } from "@/components/ui/date-picker";

const getColumns = (
    sort: { column: string; direction: "asc" | "desc" },
    onSort: (column: string) => void,
    rolesForCreateOptions: IRoleForCreateOptions[]
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
                        {row.original.avatar_url ? (
                            <img src={row.original.avatar_url} alt={row.original.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                <Clipboard className="w-4 h-4" />
                            </div>
                        )}
                        <span className="font-medium">{row.original.name}</span>
                    </div>
                ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                const isSorted = sort.column === "email";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort("email")}
                    >
                        Email
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
                    <span title={row.original.email} className="truncate max-w-[150px]">
                        {row.original.email.length > 20
                            ? `${row.original.email.slice(0, 20)}...`
                            : row.original.email}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "role",
            header: ({ column }) => {
                const isSorted = sort.column === "role";
                return (
                    <Button
                        variant="ghost"
                        className="h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort("role")}
                    >
                        Perfil
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
                    <span>{row.original.role_user}</span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                const isSorted = sort.column === "status";
                return (
                    <Button
                        variant="ghost"
                        className="w-full flex justify-center items-center h-auto p-0 font-semibold hover:bg-transparent"
                        onClick={() => onSort("status")}
                    >
                        Ativo/Inativo
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
                const active = row.original.active;

                const handleChange = () => {
                    router.put(
                        route("users.active", row.original.external_id),
                        {
                            preserveState: true,
                            preserveScroll: true,
                        }
                    );
                };

                return (
                    <div className="flex justify-center items-center gap-2">
                        <Switch checked={active} onCheckedChange={handleChange} />
                    </div>
                )
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
                const user = row.original;

                const [isUserFormOpen, setIsUserFormOpen] = useState<boolean>(false);
                const onAddUserForm = () => setIsUserFormOpen(!isUserFormOpen);

                const [isOpenAlertDelete, setIsOpenAlertDelete] =
                    useState<boolean>(false);
                const onAlertDelete = () =>
                    setIsOpenAlertDelete(!isOpenAlertDelete);

                const [isOpenAlertResetPassword, setIsOpenAlertResetPassword] =
                    useState<boolean>(false);
                const onAlertResetPassword = () =>
                    setIsOpenAlertResetPassword(!isOpenAlertResetPassword);

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

                const handleDelete = (external_id: string) => {
                    router.delete(route("users.destroy", external_id), {
                        preserveState: true,
                        preserveScroll: true,
                        forceFormData: true,
                    });
                };

                const handleResetPassword = (external_id: string) => {
                    router.put(route("users.reset-password", external_id), {
                        preserveState: true,
                        preserveScroll: true,
                    });
                };

                return (
                    <>
                        {useHasAnyPermission([
                            "users_list",
                            "users_edit",
                            "users_delete",
                        ]) && (
                                <div className="flex items-center justify-end gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                            >
                                                <span className="sr-only">Opções</span>
                                                <MoreHorizontal />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                            {useHasPermission("users_list") && (
                                                <Link
                                                    href={route(
                                                        "users.show",
                                                        user.external_id
                                                    )}
                                                >
                                                    <DropdownMenuItem>
                                                        Visualizar
                                                    </DropdownMenuItem>
                                                </Link>
                                            )}
                                            {useHasPermission("users_edit") && (
                                                <>
                                                    <DropdownMenuItem
                                                        onClick={onAddUserForm}
                                                    >
                                                        Atualizar
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={onAlertResetPassword}
                                                    >
                                                        Resetar Senha
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                            <DropdownMenuSeparator />
                                            {useHasPermission("users_delete") && (
                                                <DropdownMenuItem onClick={onAlertDelete} className="text-red-600">
                                                    Deletar
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>

                                    <AlertDialog open={isOpenAlertDelete}>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Você tem certeza absoluta?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta ação não pode ser desfeita.
                                                    Isso excluirá permanentemente esse
                                                    usuário do sistema.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel
                                                    onClick={onAlertDelete}
                                                >
                                                    Cancelar
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => {
                                                        handleDelete(user.external_id);
                                                        onAlertDelete();
                                                    }}
                                                    className="bg-red-500 hover:bg-red-900"
                                                >
                                                    Continuar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    {/* Alerta ao resetar senha */}
                                    <AlertDialog open={isOpenAlertResetPassword}>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Redefinir a senha de {user.name}
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Com essa ação, a senha do usuário
                                                    será redefinida e aparecerá na sua
                                                    tela.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel
                                                    onClick={onAlertResetPassword}
                                                >
                                                    Cancelar
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => {
                                                        handleResetPassword(
                                                            user.external_id
                                                        );
                                                        onAlertResetPassword();
                                                    }}
                                                    className="bg-yellow-500 hover:bg-yellow-900"
                                                >
                                                    Confirmar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <UserFormDialog
                                        data={user}
                                        external_id={user.external_id}
                                        isOpen={isUserFormOpen}
                                        setIsOpen={setIsUserFormOpen}
                                        rolesForCreateOptions={rolesForCreateOptions}
                                        onSubmit={handleUpdate}
                                    />
                                </div>
                            )}
                    </>
                );
            },
        },
    ];

export default function Index({ users, rolesForCreateOptions, queryParams, flash }: IUserProps) {
    const [userData, setUserData] = useState<IUser[]>(users.data);
    const [currentPage, setCurrentPage] = useState(users.current_page);
    const [lastPage, setLastPage] = useState(users.last_page);
    const [perPage, setPerPage] = useState(users.per_page);
    const [searchValue, setSearchValue] = useState(queryParams.search ?? "");
    const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" }>({
        column: queryParams.sort_column ?? "role",
        direction: queryParams.sort_direction ?? "asc"
    });

    const [copied, setCopied] = useState(false);

    const handleSort = (column: string) => {
        const newDirection: "asc" | "desc" = sort.column === column && sort.direction === "asc" ? "desc" : "asc";
        const newSort = { column, direction: newDirection };
        setSort(newSort);
        setCurrentPage(1);
        fetchUsers(1, perPage, searchValue, newSort);
    };

    const [columns, setColumns] = useState(getColumns(sort, handleSort, rolesForCreateOptions));

    useEffect(() => {
        setUserData(users.data);
        setColumns(getColumns(sort, handleSort, rolesForCreateOptions));
        setCurrentPage(users.current_page);
        setLastPage(users.last_page);
        setPerPage(users.per_page);

        if (queryParams.sort_column && queryParams.sort_direction) {
            setSort({
                column: queryParams.sort_column,
                direction: queryParams.sort_direction as "asc" | "desc"
            });
        }

        setFilters({
            name: queryParams.filter_name ?? "",
            email: queryParams.filter_email ?? "",
            role: queryParams.filter_role ?? "",
            status: queryParams.filter_status ? queryParams.filter_status : "all",
            created_at_start: queryParams.filter_created_at_start ?? "",
            created_at_end: queryParams.filter_created_at_end ?? "",
        });
    }, [users, queryParams]);

    useEffect(() => {
        if (userData.length === 0 && currentPage > 1) {
            fetchUsers(currentPage - 1, perPage, searchValue, sort);
        }
    }, [userData]);

    const [filters, setFilters] = useState({
        name: queryParams.filter_name ?? "",
        email: queryParams.filter_email ?? "",
        role: queryParams.filter_role ?? "",
        status: queryParams.filter_status ? queryParams.filter_status : "all",
        created_at_start: queryParams.filter_created_at_start ?? "",
        created_at_end: queryParams.filter_created_at_end ?? "",
    });
    const [showFilters, setShowFilters] = useState(false);

    const applyFilters = () => {
        setCurrentPage(1);
        const filtersToSend = {
            name: filters.name,
            email: filters.email,
            role: filters.role,
            status: filters.status === "all" ? "" : filters.status,
            created_at_start: filters.created_at_start ? localToUtcIso(filters.created_at_start) ?? "" : "",
            created_at_end: filters.created_at_end ? localToUtcIso(filters.created_at_end) ?? "" : "",
        };
        fetchUsersWithFilters(1, perPage, searchValue, sort, filtersToSend);
    };

    const clearFilters = () => {
        const emptyFilters = { name: "", email: "", role: "", status: "all", created_at_start: "", created_at_end: "" };
        setFilters(emptyFilters);
        setCurrentPage(1);
        fetchUsersWithFilters(1, perPage, searchValue, sort, { name: "", email: "", role: "", status: "", created_at_start: "", created_at_end: "" });
    };

    const fetchUsersWithFilters = (
        page = 1,
        perPage = 10,
        search = "",
        sort = { column: "role", direction: "asc" as "asc" | "desc" },
        filters = { name: "", email: "", role: "", status: "", created_at_start: "", created_at_end: "" }
    ) => {
        router.get(route('users.index'), {
            page,
            per_page: perPage,
            search,
            sort_column: sort.column,
            sort_direction: sort.direction,
            filter_name: filters.name,
            filter_email: filters.email,
            filter_role: filters.role,
            filter_status: filters.status,
            filter_created_at_start: filters.created_at_start,
            filter_created_at_end: filters.created_at_end,
        }, {
            preserveState: true,
            replace: true
        });
    };

    const fetchUsers = (page = 1, perPage = 10, search = "", sort = { column: "role", direction: "asc" as "asc" | "desc" }) => {
        const filtersToSend = {
            name: filters.name,
            email: filters.email,
            role: filters.role,
            status: filters.status === "all" ? "" : filters.status,
            created_at_start: filters.created_at_start ? localToUtcIso(filters.created_at_start) ?? "" : "",
            created_at_end: filters.created_at_end ? localToUtcIso(filters.created_at_end) ?? "" : "",
        };
        fetchUsersWithFilters(page, perPage, search, sort, filtersToSend);
    };

    const onPageChange = (page: number) => {
        setCurrentPage(page);
        if (page != users.current_page) {
            fetchUsers(page, perPage, searchValue, sort);
        }
    };

    const onSearchSubmit = () => {
        fetchUsers(1, perPage, searchValue, sort);
    };

    const onRowsPerPageChange = (rows: number) => {
        setPerPage(rows);
        setCurrentPage(1);
        if (rows != users.per_page) {
            fetchUsers(1, rows, searchValue, sort);
        }
    };

    const [isUserFormOpen, setIsUserFormOpen] = useState<boolean>(false);
    const onAddUserForm = () => setIsUserFormOpen(!isUserFormOpen);

    const [isOpenAlertNewPassword, setIsOpenAlertNewPassword] =
        useState<boolean>(false);
    const onAlertNewPassword = () =>
        setIsOpenAlertNewPassword(!isOpenAlertNewPassword);

    const copyToClipboard = () => {
        if (flash.newPassword) {
            navigator.clipboard.writeText(flash.newPassword);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    useEffect(() => {
        if (flash.newPassword) {
            onAlertNewPassword();
        }
    }, [flash.newPassword]);

    const handleSubmit = (values: z.infer<ReturnType<typeof userFormSchema>>) => {
        router.post(route('users.store'), values, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                onAddUserForm();
            },
            onError: (errors) => {
                console.error(errors);
            },
            forceFormData: true,
        });
    };

    return (
        <AuthenticatedLayout header="Lista de Usuários">
            <Head title="Lista de Usuários" />
            <div className="flex flex-1 flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Lista de Usuários</h2>

                    {/* Controles de Filtro */}
                    <div className="flex items-center gap-2">
                        <Popover open={showFilters} onOpenChange={setShowFilters}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className={`${(filters.name || filters.email || filters.role || (filters.status && filters.status !== "all")) ? 'border-blue-500 bg-blue-50' : ''}`}
                                >
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtros
                                    {(filters.name || filters.email || filters.role || (filters.status && filters.status !== "all")) && (
                                        <span className="ml-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                            {[filters.name, filters.email, filters.role, filters.status !== "all" ? filters.status : null].filter(Boolean).length}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Filtros Avançados</h4>
                                        {(filters.name || filters.email || filters.role || (filters.status && filters.status !== "all")) && (
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
                                                Nome do Usuário
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
                                            <Label htmlFor="filter-email" className="text-sm font-medium">
                                                Email do Usuário
                                            </Label>
                                            <Input
                                                id="filter-email"
                                                placeholder="Filtrar por email..."
                                                value={filters.email}
                                                onChange={(e) => setFilters(prev => ({ ...prev, email: e.target.value }))}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="filter-role" className="text-sm font-medium">
                                                Perfil do Usuário
                                            </Label>
                                            <Input
                                                id="filter-role"
                                                placeholder="Filtrar por perfil..."
                                                value={filters.role}
                                                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                                                className="mt-1"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="filter-status" className="text-sm font-medium">
                                                Status do Usuário
                                            </Label>
                                            <Select
                                                value={filters.status}
                                                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Selecionar status..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todos</SelectItem>
                                                    <SelectItem value="active">Ativo</SelectItem>
                                                    <SelectItem value="inactive">Inativo</SelectItem>
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
                    data={userData}
                    columns={columns}
                    currentPage={currentPage}
                    lastPage={lastPage}
                    rowsPerPage={perPage}
                    searchValue={searchValue}
                    onSearchCharge={setSearchValue}
                    searchPlaceholder="Pesquisar por nome da usuário..."
                    onSearchSubmit={onSearchSubmit}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    onAdd={onAddUserForm}
                    permissions={{
                        create: "users_create",
                    }}
                />
            </div>

            {/* Alerta ao resetar senha */}
            <AlertDialog open={isOpenAlertNewPassword}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Nova senha foi gerada!
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            A nova senha foi gerada com sucesso. Copie a senha e
                            compartilhe com o usuário.
                        </AlertDialogDescription>
                        <AlertDialogDescription className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                            <span className="font-mono text-lg">
                                {flash.newPassword}
                            </span>
                            <Button
                                onClick={copyToClipboard}
                                className="p-2 rounded-md bg-gray-200 hover:bg-gray-300"
                            >
                                {copied ? (
                                    <ClipboardCheck className="text-green-600" />
                                ) : (
                                    <Clipboard className="text-gray-700" />
                                )}
                            </Button>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction
                            onClick={onAlertNewPassword}
                            className="bg-green-500 hover:bg-green-900"
                        >
                            Ok
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <UserFormDialog
                isOpen={isUserFormOpen}
                setIsOpen={setIsUserFormOpen}
                rolesForCreateOptions={rolesForCreateOptions}
                onSubmit={handleSubmit}
            />
        </AuthenticatedLayout>
    );
}
