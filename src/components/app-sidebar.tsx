import * as React from "react"
import {
  IconInnerShadowTop
} from "@tabler/icons-react"

import {NavMain} from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent, SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type {NavItem} from "@/config/navigation.ts";
import {Link} from "react-router-dom";
import {NavUser} from "@/components/nav-user.tsx";
import {useAuth} from "@/AuthProvider.tsx";
import {NavigationSkeleton} from "@/components/skeletons/navigation-skeleton.tsx";

export function AppSidebar({items, ...props}: {
  items: NavItem[]
} & React.ComponentProps<typeof Sidebar>) {
  const { profile } = useAuth();

  if (items.length === 0) {
    return <NavigationSkeleton {...props} />
  }

  return (
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                  asChild
                  className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <Link to={"/"}>
                  <IconInnerShadowTop className="!size-5"/>
                  <span className="text-base font-semibold">bus.stop</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={items}/>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={profile} />
        </SidebarFooter>
      </Sidebar>
  )
}
