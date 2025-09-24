"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Link } from "@inertiajs/react";
import { useHasPermission } from "@/utils/permissions";

export function NavMain({
    items,
}: {
    items: {
        title: string
        url?: string
        icon: LucideIcon
        isActive?: boolean
        permission?: string
        items?: {
            title: string
            url: string
            permission?: string
        }[]
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    useHasPermission(item.permission) && (
                        <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    {item.url ? (
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </div>
                                    )}
                                </SidebarMenuButton>
                                {item.items?.length ? (
                                    <>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuAction className="data-[state=open]:rotate-90">
                                                <ChevronRight />
                                                <span className="sr-only">Toggle</span>
                                            </SidebarMenuAction>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem) => (
                                                    useHasPermission(subItem.permission) && (
                                                        <SidebarMenuSubItem key={subItem.title}>
                                                            <SidebarMenuSubButton asChild>
                                                                <Link href={subItem.url}>
                                                                    <span>{subItem.title}</span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    )
                                                ))}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </>
                                ) : null}
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
