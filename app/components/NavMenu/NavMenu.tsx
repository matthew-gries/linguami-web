import Link from "next/link";
import styles from "./NavMenu.module.css";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import SignInButton from "@/app/components/SignInButton";
import ProfileDropDown from "../ProfileDropDown";
import Image from "next/image";

export async function NavMenu() {

  const session = await getServerSession(authOptions);

  function getSignInOrProfileButton() {

    return session ? (
      <ProfileDropDown />
    ) : (
      <SignInButton />
    );
  }

  return (
    <nav className={styles.navMenu}>
      <Link className={styles.navMenuIcon} href={'/'}>
        <Image src='/logo.png' alt='logo' width={32} height={32} />
        <p className={styles.navMenuIconText}>LinguAmi</p>
      </Link>
      <div className={styles.navMenuContainer}>
        {getSignInOrProfileButton()}
      </div>
    </nav>
  );
}