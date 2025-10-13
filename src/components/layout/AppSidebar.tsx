import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderKanban, Settings, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

const menuItems = [
  { key: "dashboard", url: "/", icon: LayoutDashboard },
  { key: "projects", url: "/projects", icon: FolderKanban },
  { key: "settings", url: "/settings", icon: Settings },
  { key: "info", url: "/info", icon: Info },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { t } = useTranslation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("app.title")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const title = t(`sidebar.${item.key}`);
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton asChild tooltip={title}>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          isActive ? "bg-sidebar-accent" : ""
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
