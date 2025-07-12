export const EnemyCard = ({ enemy, styles }) => (
    <div className={styles.individualEnemyContainer}>
        <h2>Enemy: {enemy.name}</h2>
        <p>Level: {enemy.level}</p>
        <p>Health: {enemy.currentHealth}/{enemy.maxHealth}</p>
        <p>Attack: {enemy.attack}</p>
        <p>Defense: {enemy.defense}</p>
    </div>
);
