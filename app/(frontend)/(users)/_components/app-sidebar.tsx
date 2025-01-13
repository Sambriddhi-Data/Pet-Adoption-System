'use client'
import { Calendar, PawPrint, BookOpenText, House, Settings } from "lucide-react"
import Link from 'next/link'
import React from 'react'
import {Sidebar,SidebarContent,SidebarGroup,SidebarGroupContent,SidebarGroupLabel,SidebarMenu,SidebarMenuButton,SidebarMenuItem,} from "@/components/ui/sidebar"
import { Logo } from "@/components/Logo";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/shelterHomepage",
    icon: PawPrint,
  },
  {
    title: "Public Page",
    url: "/publicPage",
    icon: BookOpenText,
  },
  {
    title: "Adoption Requests",
    url: "/adoptionRequests",
    icon: Calendar,
  },
  {
    title: "Rehoming Requests",
    url: "#",
    icon: House,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Link href="/">
              <Logo />
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className=" text-white flex flex-col gap-8">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon size={32} className="w-15 h-15 text-current" />
                      <span className="text-lg font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

