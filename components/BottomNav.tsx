"use client";

import { TabBar } from "antd-mobile";
import { usePathname, useRouter } from "next/navigation";
import { bottomNavCopy } from "@/config";
import styles from "./BottomNav.module.css";

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
          const item = bottomNavCopy.items.find((navItem) => navItem.key === key);

          if (!item) {
            return;
          }

          if ("href" in item) {
            router.push(item.href);
          }
        }}
      >
        {bottomNavCopy.items.map((item) => (
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
