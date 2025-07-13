export const EnemyCard = ({ enemy, styles }) => {
    const healthPercent = enemy.currentHealth / enemy.maxHealth;

    let healthColor = "#00cc66";
    if (healthPercent <= 0.5) healthColor = "#ffcc00";
    if (healthPercent <= 0.25) healthColor = "#e63946";

    return (
        <div className={styles.individualEnemyContainer}>
            <h1>Enemy: {enemy.name}</h1>
            <p>Level: {enemy.level}</p>
            <div className={styles.healthWrapper}>
                <span className={styles.healthLabel}>HP</span>
                <div className={styles.healthBarContainer}>
                    <div
                        className={styles.healthBarFill}
                        style={{
                            width: `${healthPercent * 100}%`,
                            backgroundColor: healthColor,
                        }}
                    ></div>
                </div>
                <span className={styles.healthNumbers}>
                    {enemy.currentHealth} / {enemy.maxHealth}
                </span>
            </div>
            <p>Attack: {enemy.attack}</p>
            <p>Defense: {enemy.defense}</p>
        </div>
    );
};