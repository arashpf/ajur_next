import styles from "../styles/Home.module.css";

export default function NotFound() {
  console.log("hai");
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>404 - Page Not Found</h1>
      </main>
    </div>
  );
}
