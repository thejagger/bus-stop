import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {SiteHeader} from "@/components/site-header.tsx";
import {Outlet} from "react-router-dom";
import * as React from "react";
import type {NavItem} from "@/config/navigation.ts";
import {GlobalAlertDialogProvider} from "@/components/global-alert-dialog.tsx";
import {QuickMenuDialog} from "@/components/quick-menu-dialog.tsx";

export default function Layout({items}: { items: NavItem[] }) {
  return (
    <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
    >
      <AppSidebar items={items} variant="inset"/>
      <SidebarInset>
        <SiteHeader items={items}/>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <GlobalAlertDialogProvider>
                <Outlet/>
              </GlobalAlertDialogProvider>
            </div>
          </div>
        </div>
      </SidebarInset>
      <QuickMenuDialog items={items}/>
    </SidebarProvider>
  );
}