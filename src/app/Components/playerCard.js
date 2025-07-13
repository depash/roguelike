import { generateEnemyBasedOnPlayerLevel } from "./enemies";
import { Player } from "./player";

export const PlayerCard = ({ player, enemies, addPlayer, styles, currentPlayer, nextPlayerTurn }) => {

    const handleAttack = () => {
        nextPlayerTurn()
    };

    const handleDefend = () => {
    };

    const healthPercent = player.currentHealth / player.maxHealth;

    let healthColor = "#00cc66";
    if (healthPercent <= 0.5) healthColor = "#ffcc00";
    if (healthPercent <= 0.25) healthColor = "#e63946";

    return (
        <div className={`${styles.individualPlayerContainer} ${currentPlayer && styles.currentPlayerContainer}`}>
            <div className={styles.playerInfo}>
                <h2>{player.name}</h2>
                <p>Level: {player.level}</p>
                <div className={styles.healthWrapper}>
                    <span className={styles.healthLabel}>HP</span>
                    <div className={styles.healthBarContainer}>
                        <div
                            className={styles.healthBarFill}
                            style={{
                                width: `${healthPercent * 100}%`,
                                backgroundColor: healthColor
                            }}
                        ></div>
                    </div>
                    <span className={styles.healthNumbers}>
                        {player.currentHealth} / {player.maxHealth}
                    </span>
                </div>
                <p>Attack: {player.attack}</p>
                <p>Defense: {player.defense}</p>
                <div className={styles.xpWrapper}>
                    <span className={styles.xpLabel}>XP</span>
                    <div className={styles.xpBarContainer}>
                        <div
                            className={styles.xpBarFill}
                            style={{ width: `${(player.exp / player.nextLevelExp) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <p>Gold: {player.gold}</p>
            </div>
            <div className={styles.playerActions}>
                <button className={styles.attackButton} onClick={handleAttack}>Attack</button>
                <button className={styles.defendButton} onClick={handleDefend}>Skills</button>
            </div>
        </div>
    );
};
