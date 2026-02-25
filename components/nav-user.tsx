"use client"
import Image from "next/image"
import { getUserName, signOut } from "@/app/action/auth"
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
import { supabase } from "@/lib/supabase"
import { EllipsisVerticalIcon, CircleUserRoundIcon, CreditCardIcon, BellIcon, LogOutIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"

export function NavUser({
  user,
}: {
  user: any
}) {
  const { isMobile } = useSidebar()
  const [displayName, setDisplayName] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single(); // Use .single() if you only expect one row

      if (data) {
        setDisplayName(data.display_name);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user?.id]);
  // const { data: result, error } = await supabase
  //       .from('profiles')
  //       .select('display_name')
  //       .eq('id', user?.id);
  const name = "Guest";
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <Avatar className="size-8 rounded-lg grayscale">
              <AvatarImage
                src="/avatar.png"
                alt="avatar" />
              {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
              {/* <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              {loading ? 
              (<Skeleton className="h-5 w-full" />) 
              : <span className="truncate font-medium">{displayName || "Guest User"}</span>
            }
              
              {/* <span className="truncate font-medium">{user.name}</span> */}
              <span className="text-foreground/70 truncate text-xs">
                {user.email}
              </span>
            </div>
            <EllipsisVerticalIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8">
                    <AvatarImage
                src="/avatar.png"
                alt="avatar" />
                    {/* <AvatarFallback className="rounded-lg">CN</AvatarFallback> */}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayName || "Guest User"}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <CircleUserRoundIcon
                />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon
                />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon
                />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOutIcon
              />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
