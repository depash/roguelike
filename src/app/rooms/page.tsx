"use client";
import React, { useState } from 'react'
import styles from "./page.module.css";
import { Player } from '../Components/player.js'
import { generateEnemyBasedOnPlayerLevel } from '../Components/generateEnemies.js'



const rooms = () => {
    const [player, setPlayer] = useState(() => new Player('player'));
    const [enemy, setEnemy] = useState(() => generateEnemyBasedOnPlayerLevel(player.level));
    const [roomNum, setRoomNum] = useState(1);

    return (
        <div>
            <h1 className={styles.roomNumber}>Room {roomNum}</h1>

            <div className={styles.mainContainer}>
                <div className={styles.enemyContainer}>
                    <h2>Enemy: {enemy.name}</h2>
                    <p>Level: {enemy.level}</p>
                    <p>Health: {enemy.currentHealth}/{enemy.maxHealth}</p>
                    <p>Attack: {enemy.attack}</p>
                    <p>Defense: {enemy.defense}</p>
                </div>

                <div className={styles.playerContainer}>
                    <div>
                        <p>Level: {player.level}</p>
                        <p>Health: {player.currentHealth}/{player.maxHealth}</p>
                        <p>Attack: {player.attack}</p>
                        <p>Defense: {player.defense}</p>
                        <p>Experience: {player.exp}/{player.nextLevelExp}</p>
                        <p>Gold: {player.gold}</p>
                    </div>

                    <div className={styles.playerActions}>
                        <button className={styles.attackButton} onClick={() => {
                            if ((enemy.currentHealth - player.attack) <= 0) {
                                const { gold, exp } = enemy.die();
                                player.gold += gold;
                                player.exp += exp;
                                if (player.exp >= player.nextLevelExp) {
                                    setPlayer(player.levelUp())
                                    setEnemy(generateEnemyBasedOnPlayerLevel(player.level + 1));
                                }
                                else {
                                    setPlayer(player)
                                    setEnemy(generateEnemyBasedOnPlayerLevel(player.level));
                                }
                                setRoomNum(roomNum + 1);
                            }
                            else {
                                setEnemy(enemy.takeDamage(player.attack));
                                setPlayer(player.takeDamage(enemy.attack));
                            }
                        }}>
                            Attack
                        </button>
                        <button className={styles.defendButton} onClick={() => {
                            setPlayer(player.takeDamage(enemy.attack - player.defense));
                        }}>
                            Defend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default rooms