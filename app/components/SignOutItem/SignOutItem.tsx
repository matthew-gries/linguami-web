'use client';

import { signOut } from "next-auth/react";
import styles from "./SignOutItem.module.css";

export function SignOutItem() {
  return (
    <button className={styles.signOutItem} onClick={() => {
      console.log("Signing out...");
      signOut({ callbackUrl: '/' });
    }}>
      Sign out
    </button>
  );
}