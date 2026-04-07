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
import posthog from "posthog-js";

type Session = typeof authClient.$Infer.Session;

export function AppSidebar() {

  
  // undefined = not yet fetched, null = no session, object = active session
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  const router = useRouter();

  const { isMobile } = useSidebar()

  const toastManager = useKumoToastManager();

  // the auth client returns an object with status/statusText/code/message
  type SessionError = {
    code?: string
    message?: string
    status: number
    statusText: string
  } | null
  const [error, setError] = useState<SessionError>(null)

  async function logOut(){
    posthog.capture('user_signed_out', {
      user_id: session?.user.id,
    });
    posthog.reset();
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin")
        }
      }
    })
  }

  /**
   * Return the initials for a display name.  If `name` is falsy this returns
   * an empty string so that callers can safely render the result directly in
   * an avatar fallback.
   */
  function getInitials(name?: string): string {
    if (!name) return "";
    const matches = name.replace(/[^A-Za-z\- ]/g, "").match(/\b\w/g);
    return matches ? matches.join("") : "";
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
    })
  }, [])

  const user = session?.user;

  if (error) {
    return (
      <Sidebar>
        <SidebarContent>
          <div className="flex flex-col gap-6">
            <WarningOctagonIcon color="red" size={64} />
            <h2 className="text-red-50">Failed to fetch session: {error.message}</h2>
          </div>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <Sidebar variant="inset">
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
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.image || `hiyyfifyiffhvbjhihiy7tt8ryyufyy`} alt={user?.name} />
                      <AvatarFallback className="rounded-lg">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => {window.location.href == `/user/ ${user?.id}`}}>
                <UserCircleIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {window.location.href == "/dashboard/settings"}}>
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