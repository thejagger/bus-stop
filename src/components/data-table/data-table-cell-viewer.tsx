import {useIsMobile} from "@/hooks/use-mobile.ts";
import {
  Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle,
} from "@/components/ui/drawer.tsx";
import type {JSX} from "react";
import {Button} from "@/components/ui/button.tsx";

export function TableCellViewer({drawerTitle, trigger, children}: {
  drawerTitle: string,
  trigger?: JSX.Element
  children: JSX.Element | JSX.Element[]
}) {
  const isMobile = useIsMobile()
  return (
      <Drawer direction={isMobile ? "bottom" : "right"}>
        <DrawerTrigger asChild>
          {trigger ??
              <Button variant="link" className="text-foreground w-fit px-0 text-left">
                {drawerTitle}
              </Button>}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{drawerTitle}</DrawerTitle>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
  )
}