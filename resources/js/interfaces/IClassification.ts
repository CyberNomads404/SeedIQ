import { ICategory } from "./ICategory";
import { ISelectData } from "./IRole";
import { IUser } from "./IUser";

interface IClassification {
    external_id: string;
    name: string;
    status: string;
    status_label?: string;
    message?: string;
    file_url: string;
    created_at?: string;
    created_at_human?: string;
    updated_at?: string;
    updated_at_human?: string;

    result?: IClassificationResult | null;
    category_for_display?: ICategory | null;
    user_for_display?: IUser | null;
}

interface IClassificationResult {
    external_id: string;
    payload: any;
    burned?: number | null;
    greenish?: number | null;
    good_grains?: number | null;
    created_at: string;
    created_at_human: string;
    updated_at: string;
    updated_at_human: string;
}

interface IClassificationData {
    data: IClassification[];
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

interface IClassificationProps {
    classifications: IClassificationData;
    status_types: ISelectData[];
    query_params: {
        search?: string;
        [key: string]: any;
    };
    flash: {
        sucess?: string;
        error?: string;
    };
}

export type { IClassification, IClassificationData, IClassificationProps };
