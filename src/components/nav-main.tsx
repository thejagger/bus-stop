import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {Collapsible, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {CollapsibleContent} from "@radix-ui/react-collapsible";
import {Link, useLocation} from "react-router-dom";
import type {NavItem} from "@/config/navigation.ts";
import {ChevronRight} from "lucide-react";
import {getNavItemByPath, isNavItemActive} from "@/utils/navigation-helper.ts";
import {useTranslation} from "react-i18next";

export function NavMain({items}: { items: NavItem[] }) {
  const {t} = useTranslation('navigation');
  const location = useLocation();
  const navItems = getNavItemByPath(items, location.pathname)

  return (
      <SidebarGroup>
        <SidebarMenu>
          {items.filter((item) => item.hideInSidebar !== true).map((item) => {
            const isActive = isNavItemActive(item, navItems);

            return item.items ?
                <Collapsible
                    key={item.path}
                    asChild
                    defaultOpen={isActive}
                    className="group/collapsible"
                >
                  <SidebarMenuItem key={item.path}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={t(item.path)}
                                         className={"cursor-pointer"}>
                        {item.icon && <item.icon/>}
                        <span>{t(item.path)}</span>
                        <ChevronRight
                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isActive = isNavItemActive(subItem, navItems);

                          return <SidebarMenuSubItem key={subItem.path}>
                            <SidebarMenuSubButton asChild
                                                  isActive={isActive}>
                              <Link to={`/${item.path}/${subItem.path}`}>
                                <span>{t(subItem.path)}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible> :
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild tooltip={t(item.path)} isActive={isActive}>
                    <Link to={`/${item.path}`}>
                      {item.icon && <item.icon/>}
                      <span>{t(item.path)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
          })}
        </SidebarMenu>
      </SidebarGroup>
  )
}
