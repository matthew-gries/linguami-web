'use client';

import { createRef, useEffect, useState } from "react";
import SignOutItem from "../SignOutItem";
import styles from "./ProfileDropDown.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";

const DEFAULT_PROFILE_PIC_URL = '/defaultprofile.jpg';

export function ProfileDropDown() {

  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = createRef<HTMLDivElement>();

  function checkForClickOutsideDropdown(event: any) {
    if (showDropdown && !dropdownRef.current?.contains(event.target)) {
      setShowDropdown(false);
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", checkForClickOutsideDropdown);

    return () => {
      document.removeEventListener("mousedown", checkForClickOutsideDropdown);
    }
  });

  function toggleProfileMenu() {
    setShowDropdown(!showDropdown);
  }

  function getProfilePicUrl() {
    if (status === 'authenticated') {
      return session?.user?.image ?? DEFAULT_PROFILE_PIC_URL;
    } else {
      return DEFAULT_PROFILE_PIC_URL;
    }
  }

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button className={styles.dropdownButton} onClick={toggleProfileMenu}>
        <Image className={styles.profilePic} src={getProfilePicUrl()} alt="Your profile picture" width={32} height={32}/>
      </button>
      <div id="dropdown-list" className={styles.dropdownList}>
        {showDropdown ? (
          <ul className={styles.dropdownContent}>
            <li className={styles.listItem}>
              <SignOutItem />
            </li>
          </ul>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}