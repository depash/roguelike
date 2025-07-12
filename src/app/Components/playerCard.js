import { generateEnemyBasedOnPlayerLevel } from "./generateEnemies";
import { Player } from "./player";

export const PlayerCard = ({ player, enemies, setPlayer, setEnemy, roomNum, setRoomNum, addPlayer, addEnemy, styles }) => {

    const handleAttack = () => {
        randomEnemy = Math.floor(Math.random() * enemies.length)
        let updatedEnemy = enemies[randomEnemy].takeDamage(player.attack);
        if (updatedEnemy.isAlive) {
            let updatedPlayer = player.takeDamage(enemies.attack - player.defense);
            if (updatedPlayer.isAlive) {
                setPlayer(updatedPlayer);
            } else {
                setPlayer(new Player('player'));
                addPlayer(generateEnemyBasedOnPlayerLevel(1));
            }
            setEnemy(enemies[randomEnemy] = updatedEnemy);
        } else {
            const { gold, exp } = updatedEnemy.die();
            player.gold += gold;
            player.exp += exp;
            if (player.exp >= player.nextLevelExp) {
                setPlayer(player.levelUp());
                addPlayer(generateEnemyBasedOnPlayerLevel(player.level + 1));
            } else {
                setPlayer(player);
                addPlayer(generateEnemyBasedOnPlayerLevel(player.level));
            }
            setRoomNum(roomNum + 1);
        }
    };

    const handleDefend = () => {
        let updatedPlayer = player.takeDamage(enemies.attack - player.defense);
        if (updatedPlayer.isAlive) {
            setPlayer(updatedPlayer);
        } else {
            setPlayer(new Player('player'));
            setEnemy(generateEnemyBasedOnPlayerLevel(1));
        }
    };

    return (
        <div className={styles.individualPlayerContainer}>
            <div>
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
