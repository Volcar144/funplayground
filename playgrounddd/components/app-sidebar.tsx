"use client"

import { useEffect, useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { UserCircleIcon, WarningOctagonIcon } from "@phosphor-icons/react";

export function AppSidebar() {
  const [session, setSession] = useState<any>(null)
  // the auth client returns an object with status/statusText/code/message
  type SessionError = {
    code?: string
    message?: string
    status: number
    statusText: string
  } | null
  const [error, setError] = useState<SessionError>(null)

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
        <div className="flex items-center gap-3 outline-solid">
          <UserCircleIcon weight="duotone" />
          <p>{session?.user?.name ?? session?.user?.email ?? "Anonymous"}</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}