import styles from '../styles/MainCatButton.module.css'

export function MainCatButton({ cat }) {
  return (
    <Link href={`/${cat.slug}`}>
      <a className={styles.mainCatButton}>
        <Image src={cat.image} alt={cat.name} layout="fill" objectFit="cover" />
        <span>{cat.name}</span>
      </a>
    </Link>
  );
}
