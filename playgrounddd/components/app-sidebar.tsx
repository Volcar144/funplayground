import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { User } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { UserCircleIcon, UserIcon, WarningOctagonIcon } from "@phosphor-icons/react";

export async function AppSidebar() {
  const { data: session, error } = await authClient.getSession()

  if(error){
    return(
      <Sidebar>
        <SidebarContent>
          <div className="flex flex-col gap 6">
            <WarningOctagonIcon color="red" size={64}/>
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
      <SidebarFooter >
       <div className="flex flex-grid gap-3 outline-solid">
        <UserCircleIcon weight="duotone"/> 
        <p>{session?.user.name}</p>
       </div>
      </SidebarFooter>
    </Sidebar>
  )
}