"use client"

import { Button, DropdownMenu } from "@cloudflare/kumo"
import { MoonIcon, SunIcon } from "@phosphor-icons/react"
import { useTheme } from "next-themes"

export default function ThemeToggle(){
    const { setTheme } = useTheme()

    return (
        <>
            <DropdownMenu>
            <DropdownMenu.Trigger render={<Button variant="outline" >
                    <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                    </Button>}></DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                    <DropdownMenu.Item onClick={() => setTheme("light")}>
                    Light
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => setTheme("dark")}>
                    Dark
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => setTheme("system")}>
                    System
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu>
        </>
    )
}