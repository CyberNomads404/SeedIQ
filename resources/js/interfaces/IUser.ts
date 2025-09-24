import { z } from "zod";
import { IRoleForCreateOptions } from "./ISelect";
import { userFormSchema } from "@/schemas/form-user-schema";
import { IAuditLog, IAuditLogData } from "./ILogs";

interface IUser {
    external_id: string;
    name: string;
    email: string;
    role_user: string;
    active: boolean;
    avatar_url: string | null;
    phone: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    email_verified_at: string | null;
    last_session_web: ILastSessionWeb | null;
    last_session_api: ILastSessionApi | null;
}

interface ILastSessionWeb {
    last_activity: string | null;
    ip_address: string | null;
    user_agent: string | null;
}

interface ILastSessionApi {
    last_used_at: string | null;
    token_name: string | null;
    created_at: string | null;
}

interface IUserData {
    data: IUser[];
    first_page_url: string;
    last_page_url: string;
    next_page_url: string;
    prev_page_url: string;
    from: number;
    per_page: number;
    total: number;
    current_page: number;
    last_page: number;
}

interface IUserProps {
    users: IUserData;
    rolesForCreateOptions: IRoleForCreateOptions[];
    queryParams: {
        search?: string;
        sort_column?: string;
        sort_direction?: "asc" | "desc";
        per_page?: number;
        filter_name?: string;
        filter_email?: string;
        filter_role?: string;
        filter_status?: string;
        [key: string]: any;
    };
    flash: {
        sucess?: string;
        error?: string;
        newPassword?: string;
    };
}

interface IUserShowProps {
    user: IUser;
    rolesForCreateOptions: IRoleForCreateOptions[];
    logs: IAuditLogData;
    logsQueryParams?: {
        logs_search?: string;
        logs_event?: string;
        logs_type?: string;
        logs_date_from?: string;
        logs_date_to?: string;
        logs_sort_column?: string;
        logs_sort_direction?: "asc" | "desc";
        logs_per_page?: number;
        [key: string]: any;
    };
    logsFilters?: {
        events: string[];
        types: string[];
    };
}

interface IUserFormDialogProps {
    data?: any;
    external_id?: string;
    rolesForCreateOptions?: IRoleForCreateOptions[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onSubmit: (
        values: z.infer<ReturnType<typeof userFormSchema>>,
        external_id?: string
    ) => void;
}

export type { IUser, IUserData, IUserProps, IUserShowProps, IUserFormDialogProps };
