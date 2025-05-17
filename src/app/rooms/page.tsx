import React from 'react'
import styles from "./page.module.css";
import { Player } from '../Components/player.js'
import { generateEnemyBasedOnPlayerLevel } from '../Components/generateEnemies.js'

const rooms = () => {
    const player = new Player('player')

    const enemy = generateEnemyBasedOnPlayerLevel(player.level)

    const roomNum = 1

    console.log(enemy)
    console.log(player)

    return (
        <div>
            <h1 className={styles.roomNumber}>Room {roomNum}</h1>
            <div className={styles.mainContainer}>
                <div className={styles.enemyContainer}>
                    <h2>Enemy: {enemy.name}</h2>
                    <p>Level: {enemy.level}</p>
                    <p>Health: {enemy.health}</p>
                    <p>Attack: {enemy.attack}</p>
                    <p>Defense: {enemy.defense}</p>
                </div>
                <div className={styles.playerContainer}>
                    <div>
                        <p>Level: {player.level}</p>
                        <p>Health: {player.health}</p>
                        <p>Attack: {player.attack}</p>
                        <p>Defense: {player.defense}</p>
                        <p>Experience: {player.exp}</p>
                        <p>Gold: {player.gold}</p>
                    </div>
                    <div className={styles.playerActions}>
                        <button className={styles.attackButton}>
                            Attack
                        </button>
                        <button className={styles.defendButton}>
                            Defend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default rooms