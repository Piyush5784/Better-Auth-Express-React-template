import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  Search,
  Bell,
  MessageCircle,
  Bookmark,
  User,
  Settings,
  LucideAccessibility,
  LogOut,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { useLogout } from "@/hooks/use-user";
import { signOut } from "@/lib/auth-client";

const routes = [
  {
    title: "Explore",
    icon: Search,
    to: "/dashboard/explore",
  },
  {
    title: "Notifications",
    icon: Bell,
    to: "/dashboard/notifications",
  },
  {
    title: "Messages",
    icon: MessageCircle,
    to: "/dashboard/messages",
  },
  {
    title: "Bookmarks",
    icon: Bookmark,
    to: "/dashboard/bookmarks",
  },
  {
    title: "Profile",
    icon: User,
    to: "/dashboard/profile",
    params: {
      username: "piyush",
    },
  },
  {
    title: "Settings",
    icon: Settings,
    to: "/dashboard/settings",
  },
];

export function AppSidebar() {
  const user = useLogout();
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <LucideAccessibility />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {routes.map((route) => (
              <SidebarMenuItem key={route.title}>
                <SidebarMenuButton asChild>
                  <Link to={route.to}>
                    <route.icon />
                    <span>{route.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
