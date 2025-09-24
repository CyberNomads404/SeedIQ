interface IAuditLog {
    id: number;
    user_id: number;
    user_name: string;
    auditable_type: string;
    auditable_id: number;
    event: string;
    old_values: Record<string, any>;
    new_values: Record<string, any>;
    ip_address: string | null;
    created_at: string;
}

interface IAuditLogData {
    data: IAuditLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
}

export type { IAuditLog, IAuditLogData };
