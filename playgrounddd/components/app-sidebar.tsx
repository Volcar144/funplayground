"use client"

import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenu,
  useSidebar
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { UserCircleIcon, UserIcon, WarningOctagonIcon, SignOutIcon } from "@phosphor-icons/react";
import {  Button, useKumoToastManager } from "@cloudflare/kumo";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDownIcon, LogOutIcon, SettingsIcon } from "lucide-react";

type Session = Awaited<ReturnType<typeof authClient.getSession>>['data'];

export function AppSidebar() {
<<<<<<< HEAD

  
  // undefined = not yet fetched, null = no session, object = active session
  const [session, setSession] = useState<Session | null | undefined>(undefined)

=======
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
>>>>>>> 89e549d225676b37acd0da30087e11f8a29a33bc
  const router = useRouter();
  const { isMobile } = useSidebar()
  const toastManager = useKumoToastManager();

  type SessionError = {
    code?: string
    message?: string
    status: number
    statusText: string
  } | null
  const [error, setError] = useState<SessionError>(null)

  async function logOut(){
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin")
        }
      }
    })
  }

<<<<<<< HEAD
  /**
   * Return the initials for a display name.  If `name` is falsy this returns
   * an empty string so that callers can safely render the result directly in
   * an avatar fallback.
   */
  function getInitials(name?: string): string {
    if (!name) return "";
    const matches = name.replace(/[^A-Za-z\- ]/g, "").match(/\b\w/g);
    return matches ? matches.join("") : "";
=======
  function getInitials(name: string | undefined | null): string {
    if (!name) return "?";
    const matches = name.replace(/[^a-zA-Z- ]/g, "").match(/\b\w/g);
    if (!matches) return name.charAt(0).toUpperCase();
    return matches.slice(0, 2).join('').toUpperCase();
>>>>>>> 89e549d225676b37acd0da30087e11f8a29a33bc
  }

  async function logOutButton(){
    toastManager.promise(logOut(), {
      loading: {title: "Logging out", description: "You will be signed out soon!"},
      success: {title: "Logged out", description: "Logged out successfully"},
      error: {title: "Error logging out!", variant: "error"}
    })
  }

  useEffect(() => {
    authClient.getSession().then(({ data, error }) => {
      setSession(data ?? null)
      setError(error ?? null)
      setIsLoading(false)
    })
  }, [])

  const user = session?.user;

  if (error) {
    return (
      <Sidebar>
        <SidebarContent>
          <div className="flex flex-col gap-6">
            <WarningOctagonIcon color="red" size={64} />
            <h2 className="text-red-500">Failed to fetch session: {error.message}</h2>
          </div>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
<<<<<<< HEAD
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.image || ""} alt={user?.name} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
=======
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                  <AvatarFallback className="rounded-lg">
                    {isLoading ? "..." : getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name || "Guest"}</span>
                  <span className="truncate text-xs">{user?.email || ""}</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </SidebarMenuButton>
>>>>>>> 89e549d225676b37acd0da30087e11f8a29a33bc
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
<<<<<<< HEAD
                      <AvatarImage src={user?.image || `hiyyfifyiffhvbjhihiy7tt8ryyufyy`} alt={user?.name} />
                      <AvatarFallback className="rounded-lg">
                        {getInitials(user?.name)}
                      </AvatarFallback>
=======
                      <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                      <AvatarFallback className="rounded-lg">{getInitials(user?.name)}</AvatarFallback>
>>>>>>> 89e549d225676b37acd0da30087e11f8a29a33bc
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user?.name || "Guest"}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserCircleIcon />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={logOutButton}>
                    <LogOutIcon />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
