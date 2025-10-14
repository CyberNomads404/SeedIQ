import { IUser } from "./IUser";

interface ICategory {
    external_id: string;
    name: string;
    status: string;
    status_label?: string;
    message?: string;
    file_url: string;

    result?: ICategoryResult | null;
    category_for_display?: ICategory | null;
    user_for_display?: IUser | null;
}

interface ICategoryResult {
    external_id: string;
    payload: string;
}

interface ICategoryData {
    data: ICategory[];
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

interface ICategoryProps {
    categories: ICategoryData;
    query_params: {
        search?: string;
        [key: string]: any;
    };
    flash: {
        sucess?: string;
        error?: string;
    };
}

export type {
    ICategory,
    ICategoryData,
    ICategoryProps,
};
