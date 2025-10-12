"use client"

import * as React from "react"
import {
    Command,
    Frame, Home, Lock,
    LifeBuoy,
    Send,
    SquareTerminal,
    UsersRound,
    User,
    BriefcaseBusiness,
    CircleDollarSign,
    UserMinus,
    Tag,
    LocateFixedIcon,
    MessageSquare,
    ShieldQuestion,
    MessageCircleQuestion,
    BarChart3
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { FeedbackModal } from "@/components/feedback-modal"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import logo from "@/assets/images/logo.png";
import config from "@/constants/config"

const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Home,
        },
        {
            title: "Perfis",
            url: "/roles",
            icon: UsersRound,
            permission: "roles_list"
        },
        {
            title: "Permissões",
            url: "/permissions",
            icon: Lock,
            permission: "permissions_list"
        },
        {
            title: "Usuários",
            url: "/users",
            icon: User,
            permission: "users_list"
        },
        {
            title: "Feedbacks",
            url: "/feedbacks",
            icon: MessageCircleQuestion,
            permission: "feedbacks_list"
        },
        {
            title: "Categorias",
            url: "/categories",
            icon: Tag,
            permission: "categories_list"
        },
        {
            title: "Classificações",
            url: "/classifications",
            icon: BarChart3,
            permission: "classifications_list"
        }
    ],
    navSecondary: [
        {
            title: "Feedback",
            url: "#",
            icon: MessageSquare,
            isModal: true
        },
        {
            title: "Suporte",
            url: "https://wa.me/5599984775125",
            icon: LifeBuoy,
        }
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { auth } = usePage<PageProps>().props;

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            {...props}
            className="h-full max-w-[260px] min-w-0 flex flex-col overflow-y-auto overflow-x-hidden border-r border-border bg-background"
        >
            <SidebarHeader className="px-4 pt-4 pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-4">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                <img src={logo} alt={config.app_name} className="rounded-lg" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{config.app_name}</span>
                                <span className="truncate text-xs">{config.app_short_description}</span>
                            </div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="flex-1 flex flex-col px-2 pb-2 min-w-0 overflow-x-hidden">
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter className="px-2 pb-2">
                <NavUser user={auth.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
