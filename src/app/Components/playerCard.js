import { generateEnemyBasedOnPlayerLevel } from "./generateEnemies";
import { Player } from "./player";

export const PlayerCard = ({ player, enemies, addPlayer, styles }) => {

    const handleAttack = () => {
    };

    const handleDefend = () => {

    };

    return (
        <div className={styles.individualPlayerContainer}>
            <div>
                <h2>{player.name}</h2>
                <p>Level: {player.level}</p>
                <p>Health: {player.currentHealth}/{player.maxHealth}</p>
                <p>Attack: {player.attack}</p>
                <p>Defense: {player.defense}</p>
                <p>Experience: {player.exp}/{player.nextLevelExp}</p>
                <p>Gold: {player.gold}</p>
            </div>
            <div className={styles.playerActions}>
                <button className={styles.attackButton} onClick={handleAttack}>Attack</button>
                <button className={styles.defendButton} onClick={handleDefend}>Skills</button>
            </div>
        </div>
    );
};
