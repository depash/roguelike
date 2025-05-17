import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.startScreen}>
      <Link href="/rooms" >
        <button className={styles.startButton}>
          Start
        </button>
      </Link>
    </div>
  );
}
