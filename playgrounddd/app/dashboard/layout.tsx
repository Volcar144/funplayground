import type { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";


export const metadata: Metadata = {
  title: "DanngDev | Home",
  description: "DD Playground home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SidebarProvider   style={
            {
            "--sidebar-width": "20rem",
            "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties
        }>
            <AppSidebar />
            <SidebarInset>
                <main>
                    <SiteHeader />
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
