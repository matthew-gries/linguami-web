import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {

  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <Link className={styles.link} href={'/about'}>About</Link>
        <Link className={styles.link} href={'https://github.com/matthew-gries/linguami-web'}>Github</Link>
      </div>
    </footer>
  );
}