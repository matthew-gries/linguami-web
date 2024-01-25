'use client';

import { signIn } from "next-auth/react";
import styles from "./SignInButton.module.css";

export function SignInButton() {
  return (
    <button className={styles.signInButton} onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}>Sign In</button>
  );
}