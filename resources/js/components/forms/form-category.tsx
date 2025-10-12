import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import Checkbox from "@/components/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categoryFormSchema } from "@/schemas/form-category-schema";
import { ICategoryFormDialogProps } from "@/interfaces/ICategory";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import AvatarUpload from "../avatar-upload";
import FileUpload from "../file-upload";

export const CategoryFormDialog: React.FC<ICategoryFormDialogProps> = ({
    data,
    external_id,
    isOpen,
    setIsOpen,
    onSubmit,
}) => {
    const { auth } = usePage<PageProps>().props;
    const isEditing = !!external_id;

    const form = useForm<z.infer<typeof categoryFormSchema>>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: data?.name || "",
            icon: data?.icon_url || null,
        },
    });

    const handleSubmit = (values: z.infer<typeof categoryFormSchema>) => {
        onSubmit(values, external_id);
    };

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    useEffect(() => {
        if (data) {
            form.reset({
                ...data,
                role_id: String(data.role_id),
                active: Boolean(data.active),
                avatar: String(data.avatar_url) ?? null,
            });
        }
    }, [data]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Editar Categoria" : "Adicionar Categoria"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Altere a categoria do sistema."
                            : "Adicione uma nova categoria ao sistema."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 items-start gap-3">
                            <FileUpload
                                value={form.watch("icon") as string}
                                onChange={(file) => {
                                    form.setValue("icon", file ?? null);
                                }}
                                shape="rounded"
                                accept={[".svg", "image/svg+xml"]}
                                maxSize={204800} // 200 KB
                            />
                        </div>
                        <div className="grid grid-cols-1 items-start gap-3">
                            <Label
                                htmlFor="name"
                                className={
                                    form.formState.errors.name
                                        ? "text-destructive"
                                        : undefined
                                }
                            >
                                Nome
                            </Label>
                            <Input
                                id="name"
                                placeholder="Digite o nome"
                                {...form.register("name")}
                            />
                            {"name" in form.formState.errors && (
                                <p className="text-destructive text-sm">
                                    {form.formState.errors.name?.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting}
                        >
                            Salvar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
