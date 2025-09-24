import { PropsWithChildren, ReactNode, useEffect } from "react";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList, BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { AppSidebar } from "@/components/app-sidebar";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { ModeToggle } from "@/components/mode-toggle";
import { toast } from "sonner";

export default function AuthenticatedLayout({
    header,
    children
}: PropsWithChildren<{
    header?: ReactNode;
}>) {
    const user = usePage<PageProps>().props.auth.user;
    const flash = usePage<PageProps>().props.flash as { error?: string; success?: string };

    useEffect(() => {
        if (flash.error) {
            toast.error("Erro!", {
                description: flash.error,
                richColors: true,
                className:
                    "bg-red-500 text-white [&>div:last-child]:text-red-500",
            });
        }
        if (flash.success) {
            toast.success("Sucesso!", {
                description: flash.success,
                richColors: true,
                className:
                    "bg-green-500 text-white [&>div:last-child]:text-green-500",
            });
        }
    }, [flash]);

    return (
        <SidebarProvider>
            <div className="flex w-screen overflow-hidden">
                {/* Sidebar fixo na tela */}
                <div className="h-full flex flex-col">
                    <AppSidebar />
                </div>
                {/* Conteúdo principal com scroll só nele */}
                <SidebarInset className="flex flex-col h-full w-full max-w-full">
                    <header className="sticky top-0 bg-background flex h-16 shrink-0 items-center gap-2 justify-between p-4 border-b md:border-none md:rounded-xl z-[10]">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator orientation="vertical" className="mr-2 h-4" />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{header}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <ModeToggle />
                    </header>
                    <main className="flex-1 p-4 md:pt-0 w-full max-w-full min-h-0 overflow-y-auto overflow-x-hidden">
                        {children}
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
