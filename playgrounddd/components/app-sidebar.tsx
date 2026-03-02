"use client"

import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { UserCircleIcon, UserIcon, WarningOctagonIcon, SignOutIcon } from "@phosphor-icons/react";
import { DropdownMenu, Button, useKumoToastManager } from "@cloudflare/kumo";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const [session, setSession] = useState<any>(null)

  const router = useRouter();

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
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin")
        }
      }
    })
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
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
      <DropdownMenu>
        <DropdownMenu.Trigger render={<SidebarMenuButton>
          <div className="flex items-center gap-3 outline-solid text-[28px]">
            <UserCircleIcon weight="duotone" size={28}/>
            <p>{session?.user?.name ?? session?.user?.email ?? "Anonymous"}</p>
          </div>  
        </SidebarMenuButton>} />
        <DropdownMenu.Content>
          <DropdownMenu.Item icon={<UserIcon />}>Profile</DropdownMenu.Item>
          <DropdownMenu.Separator></DropdownMenu.Separator>
          <DropdownMenu.Item icon={<SignOutIcon color="red"/>} variant="danger"><Button variant="ghost" color="red" className="text-red-50" onClick={logOutButton}>Log out</Button></DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}