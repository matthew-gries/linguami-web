import styles from "./page.module.css";
import { authOptions } from './api/auth/[...nextauth]/authOptions';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { BarLoader } from "react-spinners";
import Image from "next/image";

export default async function Home() {

  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  function renderFrontPage() {
    return (
      <div className={styles.root}>
        <Image className={styles.stickerItem} alt='sticker1' src="/sticker1.png" width={256} height={256} />
        <div className={styles.textItem}>
          <h3 className={styles.padText}>LinguAmi</h3>
          <p className={styles.padText}>Welcome to LinguAmi! Practice speaking and listening with the power of generative AI. Sign up today!</p>
        </div>
      </div>
    );
  }

  return (!session) ? renderFrontPage(): (
    <div className={styles.redirectPage}>
      <div className="loading">
        <BarLoader />
      </div>
    </div>
  );
}
