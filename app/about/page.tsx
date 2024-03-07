import styles from "./page.module.css";

export default function About() {
  return (
    <div>
      <p className={styles.paragraph}>
        LinguAmi is a web app used to help with language learning utilizing large language models. It is inteded to be a supplementary resource
        for practicing speaking and listening. LinguAmi is currently in beta, and new features are being added all the time.
      </p>
      <br />
      <p className={styles.paragraph}>
        Credit to OpenAI for usage of their ChatGPT API.
      </p>
      <br />
      <div className={styles.paragraph}>
        <a className={styles.link} href="https://www.flaticon.com/free-icons/languages" title="languages icons">
          Languages icons created by Freepik - Flaticon
        </a>
        <br />
        <a className={styles.link} href="https://www.flaticon.com/free-stickers/languages" title="languages stickers">
          Languages stickers created by Stickers - Flaticon
        </a>
      </div>
    </div>
  );
}