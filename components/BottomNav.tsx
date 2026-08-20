"use client";

import { TabBar } from "antd-mobile";
import { usePathname, useRouter } from "next/navigation";
import styles from "./BottomNav.module.css";

const navItems = [
  { key: "home", label: "首页", icon: "home", href: "/" },
  { key: "note", label: "历史", icon: "note", href: "/history" },
  { key: "meter", label: "语气", icon: "meter", href: "/tone" },
  { key: "user", label: "我的", icon: "user", href: "/profile" },
] as const;

function getActiveKey(pathname: string) {
  if (pathname === "/tone") {
    return "meter";
  }
  if (pathname === "/history") {
    return "note";
  }
  if (pathname === "/profile") {
    return "user";
  }

  return "home";
}

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className={styles.nav}>
      <TabBar
        activeKey={getActiveKey(pathname)}
        className={styles.tabBar}
        onChange={(key) => {
          const item = navItems.find((navItem) => navItem.key === key);

          if (!item) {
            return;
          }

          if ("href" in item) {
            router.push(item.href);
          }
        }}
      >
        {navItems.map((item) => (
          <TabBar.Item
            key={item.key}
            icon={
              <span
                className={`nav-icon nav-icon-${item.icon}`}
                aria-hidden="true"
              />
            }
            title={item.label}
          />
        ))}
      </TabBar>
    </nav>
  );
}
