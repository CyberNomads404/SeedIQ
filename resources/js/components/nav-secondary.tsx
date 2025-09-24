import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { Link } from "@inertiajs/react"
import { FeedbackModal } from "@/components/feedback-modal"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isModal?: boolean
}

export function NavSecondary({
  items,
  ...props
}: {
  items: NavItem[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.isModal && item.title === "Feedback" ? (
                <FeedbackModal>
                  <SidebarMenuButton size="sm" className="w-full cursor-pointer">
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </FeedbackModal>
              ) : (
                <SidebarMenuButton asChild size="sm">
                  <a href={item.url} target={item.url.startsWith('http') ? '_blank' : undefined}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
