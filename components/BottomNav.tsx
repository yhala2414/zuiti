"use client";

import { TabBar } from "antd-mobile";
import { bottomNavCopy } from "@/config";
import styles from "./BottomNav.module.css";

export function BottomNav() {
  return (
    <nav className={styles.nav}>
      <TabBar activeKey={bottomNavCopy.activeKey} className={styles.tabBar}>
        {bottomNavCopy.items.map((item) => (
          <TabBar.Item
            key={item.key}
            icon={<span className={`nav-icon nav-icon-${item.icon}`} aria-hidden="true" />}
            title={item.label}
          />
        ))}
      </TabBar>
    </nav>
  );
}
