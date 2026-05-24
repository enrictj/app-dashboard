"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Target,
  Calendar,
  BarChart3,
  StickyNote,
  PanelLeftClose,
  PanelLeft,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { t } from "@/lib/i18n/ca";

const navItems = [
  { href: "/", label: t.nav.dashboard, icon: LayoutDashboard },
  { href: "/habits", label: t.nav.habits, icon: Target },
  { href: "/calendar", label: t.nav.calendar, icon: Calendar },
  { href: "/stats", label: t.nav.stats, icon: BarChart3 },
  { href: "/notes", label: t.nav.notes, icon: StickyNote },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur-xl"
    >
      <motion.div className="flex h-14 items-center gap-2 border-b border-border/60 px-4">
        <motion.div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <LayoutGrid className="h-4 w-4" />
        </motion.div>
        {!sidebarCollapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="truncate text-sm font-semibold tracking-tight"
          >
            {t.appName}
          </motion.p>
        )}
      </motion.div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          const link = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  active && "text-primary"
                )}
              />
              {!sidebarCollapsed && (
                <span className="truncate font-medium">{item.label}</span>
              )}
              {active && !sidebarCollapsed && (
                <motion.div
                  layoutId="nav-indicator"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </Link>
          );

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger className="block w-full">{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }
          return link;
        })}
      </nav>

      <motion.div className="border-t border-border/60 p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>{t.nav.collapse}</span>
            </>
          )}
        </Button>
      </motion.div>
    </motion.aside>
  );
}
