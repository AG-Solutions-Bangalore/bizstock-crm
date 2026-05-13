import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import React from "react";

const itemVariants = {
  open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hover: { scale: 1.01 },
};

export function NavMain({ items, label = "Home" }) {
  const location = useLocation();
  
  const handleLinkClick = (e) => {
    const sidebarContent = document.querySelector(".sidebar-content");
    if (sidebarContent) {
      sessionStorage.setItem("sidebarScrollPosition", sidebarContent.scrollTop);
    }
  };

  React.useEffect(() => {
    const sidebarContent = document.querySelector(".sidebar-content");
    const scrollPosition = sessionStorage.getItem("sidebarScrollPosition");

    if (sidebarContent && scrollPosition) {
      sidebarContent.scrollTop = parseInt(scrollPosition);
    }
  }, [location.pathname]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <SidebarGroup>
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          const isParentActive = hasSubItems 
            ? item.items.some((subItem) => subItem.url === location.pathname)
            : location.pathname === item.url;

          if (!hasSubItems) {
          
            return (
              <SidebarMenuItem key={item.title}>
                <Link to={item.url} onClick={handleLinkClick}>
                  <motion.div variants={buttonVariants} whileHover="hover">
                    <SidebarMenuButton 
                      tooltip={item.title}
                      className={`transition-all duration-200 ${
                        isParentActive
                          ? "bg-yellow-100 text-yellow-900 font-semibold"
                          : "hover:bg-yellow-50 text-gray-700"
                      }`}
                    >
                      {item.icon && <item.icon className={isParentActive ? "text-yellow-700" : "text-gray-500"} />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </motion.div>
                </Link>
              </SidebarMenuItem>
            );
          }

         
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <motion.div variants={buttonVariants} whileHover="hover">
                    <SidebarMenuButton 
                      tooltip={item.title}
                      className={`transition-all duration-200 ${
                        isParentActive
                          ? "bg-yellow-50/50 text-yellow-900 font-semibold"
                          : "hover:bg-yellow-50 text-gray-700"
                      }`}
                    >
                      {item.icon && <item.icon className={isParentActive ? "text-yellow-700" : "text-gray-500"} />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </motion.div>
                </CollapsibleTrigger>
                <CollapsibleContent
                  as={motion.div}
                  variants={itemVariants}
                  initial="closed"
                  animate={isParentActive ? "open " : "closed"}
                >
                  <SidebarMenuSub className="border-l-2 border-yellow-200 ml-4 pl-2 space-y-1">
                    {item.items?.map((subItem) => {
                      const isSubItemActive = location.pathname === subItem.url;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.url} onClick={handleLinkClick}>
                              <motion.span
                                className={`flex-1 px-2 py-1.5 rounded-md transition-all duration-200 ${
                                  isSubItemActive
                                    ? "bg-yellow-100 text-yellow-900 font-medium"
                                    : "text-gray-600 hover:text-yellow-700 hover:bg-yellow-50/50"
                                }`}
                                whileHover={{ x: 4 }}
                              >
                                {subItem.title}
                              </motion.span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}