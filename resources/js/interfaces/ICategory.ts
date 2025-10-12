import { z } from "zod";
import { categoryFormSchema } from "@/schemas/form-category-schema";

interface ICategory {
    external_id: string;
    name: string;
    icon?: string;
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
    accessibilities: ICategoryData;
    query_params: {
        search?: string;
        [key: string]: any;
    };
    flash: {
        sucess?: string;
        error?: string;
    };
}

interface ICategoryFormDialogProps {
    data?: any;
    external_id?: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onSubmit: (
        values: z.infer<typeof categoryFormSchema>,
        external_id?: string
    ) => void;
}

export type {
    ICategory,
    ICategoryData,
    ICategoryFormDialogProps,
    ICategoryProps,
};
