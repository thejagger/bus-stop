import {
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {supabase} from "@/lib/supabase-client.ts";
import {Link} from "react-router-dom";
import type {Profile} from "@/app/users/model/profile.model.ts";

export function NavUser({
                          user,
                        }: {
  user: Profile | null;
}) {
  const {isMobile} = useSidebar()

  let fallbackName = ''
  const email = user?.email || '';
  const fullName = (user?.first_name || '') + ' ' + (user?.last_name || '');

  if (user?.first_name && user?.last_name) {
    fallbackName = user.first_name[0] + user.last_name[0]
  } else if(user?.email) {
    fallbackName = user.email.substring(0, 2).toUpperCase()
  } else {
    fallbackName = ''
  }


  return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={email} alt={email}/>
                  <AvatarFallback className="rounded-lg">{fallbackName}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span
                      className="truncate font-medium">{fullName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                  {email}
                </span>
                </div>
                <IconDotsVertical className="ml-auto size-4"/>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={email} alt={email}/>
                    <AvatarFallback className="rounded-lg">{fallbackName}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span
                        className="truncate font-medium">{fullName}</span>
                    <span className="text-muted-foreground truncate text-xs">
                    {email}
                  </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <IconUserCircle/>
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconNotification/>
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator/>
              <DropdownMenuItem onClick={() => supabase.auth.signOut()}>
                <IconLogout/>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
  )
}
