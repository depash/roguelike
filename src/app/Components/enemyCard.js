import { useState } from "react";

export const EnemyCard = ({ enemyIndex, enemy, styles, attacking, handleEnemyAttack }) => {
    const healthPercent = enemy.currentHealth / enemy.maxHealth;
    let healthColor = "#00cc66";
    if (healthPercent <= 0.5) healthColor = "#ffcc00";
    if (healthPercent <= 0.25) healthColor = "#e63946";

    return (
        <div
            className={`${styles.individualEnemyContainer} ${attacking && enemy.isAlive ? styles.selectedEnemy : ""} ${!enemy.isAlive ? styles.enemyDead : ""}`}
            onClick={() => { attacking && enemy.isAlive ? handleEnemyAttack(enemy, enemyIndex) : "" }}
        >
            <h1>Enemy: {enemy.name}</h1>
            <p>Level: {enemy.level}</p>
            <div className={styles.healthBarContainer}>
                <span className={styles.healthBarLabel}>HP</span>
                <div className={styles.healthBarWrapper}>
                    <div
                        className={styles.healthBarProgress}
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