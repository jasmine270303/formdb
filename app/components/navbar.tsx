"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { UserAccountNav } from "./user-account-nav"
import { ModeToggle } from "./ModeToggle"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Forms", href: "/forms" },
    { name: "Settings", href: "/settings" },
  ]

  return (
    <div className="flex justify-between items-center p-3 pl-40 pr-40 border-b">
      
      <div className="font-semibold text-lg">New Space</div>

      <div className="flex gap-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "px-4 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-gray-200 dark:bg-gray-700"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                )}
              >
                {item.name}
              </button>
            </Link>
          )
        })}
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <UserAccountNav />
      </div>
    </div>
  )
}