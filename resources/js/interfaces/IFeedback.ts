export interface Feedback {
    id: number;
    external_id: string;
    type: string;
    type_label: string;
    message: string;
    attachment: string | null;
    attachment_url: string | null;
    mime_type: string | null;
    page: string | null;
    device: string | null;
    app_version: string | null;
    user_agent: string | null;
    ip_address: string | null;
    read_at: string | null;
    created_at: string;
}

export interface FeedbackIndexProps {
    feedbacks: {
        data: Feedback[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    queryParams: Record<string, any>;
    can?: Record<string, boolean>;
}
