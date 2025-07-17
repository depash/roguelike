import styles from "./enemyCard.module.css";
import shared from "./shared.module.css";

export const EnemyCard = ({ enemyIndex, enemy, actionType, handleEnemyAttack, aoe }) => {
    const healthPercent = enemy.currentHealth / enemy.maxHealth;
    let healthColor = "#00cc66";
    if (healthPercent <= 0.5) healthColor = "#ffcc00";
    if (healthPercent <= 0.25) healthColor = "#e63946";

    return (
        <div
            className={`
                ${styles.individualEnemyContainer} 
                ${actionType === "attack" && enemy.isAlive && aoe ? styles.enemySelectableAoe : null} 
                ${actionType === "attack" && enemy.isAlive && !aoe ? styles.enemySelectable : null} 
                ${!enemy.isAlive ? styles.enemyDead : null}
                `}
            onClick={() => { actionType === "attack" && enemy.isAlive ? handleEnemyAttack(enemyIndex) : null }}
        >
            <h1>Enemy: {enemy.name}</h1>
            <p>Level: {enemy.level}</p>
            <div className={shared.healthBarContainer}>
                <span className={shared.healthBarLabel}>HP</span>
                <div className={shared.healthBarWrapper}>
                    <div
                        className={shared.healthBarProgress}
                        style={{
                            width: `${healthPercent * 100}%`,
                            backgroundColor: healthColor,
                        }}
                    ></div>
                </div>
                <span className={shared.healthNumbers}>
                    {enemy.currentHealth} / {enemy.maxHealth}
                </span>
            </div>
            <p>Attack: {enemy.attack}</p>
            <p>Defense: {enemy.defense}</p>
        </div>
    );
};