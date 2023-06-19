"use client";
import styles from "@/styles/tabbar.module.scss";
import { useState } from "react";
function Tabbar() {
  const [selected, setSelected] = useState(0);

  return (
    <div className={`${styles.selector} mx-4 sm:mx-2 gap-4 text-xl`}>
      <div className={styles.link}></div>

      <div className={`${styles.selection} ${selected == 0 ? styles.selected : null}`} onClick={() => setSelected(0)}>
        Articles
      </div>
      <div className={`${styles.selection} ${selected == 1 ? styles.selected : null}`} onClick={() => setSelected(1)}>
        Blogs
      </div>
    </div>
  );
}

export default Tabbar;
