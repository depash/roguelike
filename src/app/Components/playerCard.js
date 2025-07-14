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
                <div className={styles.healthBarContainer}>
                    <span className={styles.healthBarLabel}>HP</span>
                    <div className={styles.healthBarWrapper}>
                        <div
                            className={styles.healthBarProgress}
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
                <div className={styles.xpBarContainer}>
                    <span className={styles.xpBarLabel}>XP</span>
                    <div className={styles.xpBarContainer}>
                        <div
                            className={styles.xpBarProgress}
                            style={{ width: `${(player.exp / player.nextLevelExp) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <p>Gold: {player.gold}</p>
            </div>
            <div className={styles.playerActions}>
                <button className={styles.attackButton} disabled={!currentPlayer} onClick={handleAttack}>Attack</button>
                <button className={styles.defendButton} disabled={!currentPlayer} onClick={handleDefend}>Skills</button>
            </div>
        </div>
    );
};
