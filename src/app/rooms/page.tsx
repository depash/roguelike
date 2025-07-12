"use client";
import React, { useState } from 'react'
import styles from "./page.module.css";
import { Player } from '../Components/player.js'
import { generateEnemyBasedOnPlayerLevel } from '../Components/generateEnemies.js'
import { EnemyCard } from '../Components/EnemyCard.js';
import { PlayerCard } from '../Components/PlayerCard.js';
import { Warrior, Healer, Mage, Rogue } from '../Components/subClasses.js';

// adding special attack/mana/recource of some kind
// adding allies (healer, mage, worrior, ranger/rouge)

// 8 max 4 on both sides

// multiple enemies
// mabey big boss at the end of each 25 rooms before endless mode of some kind
// get random allie as the rooms go on
// add diffrent fonts to players and enemies
// mabey adding shop or rest area to spend gold

// adding sounds of combat
// add images to enimies and players
// floors that be what determines allies being added or rest spot

const rooms = () => {

    const [players, setPlayers] = useState([new Player('Warrior')]);
    const [enemies, setEnemies] = useState([generateEnemyBasedOnPlayerLevel(1)]);
    const [roomNum, setRoomNum] = useState(1);
    const [floorNum, setFloorNum] = useState(1);
    const [turn, setTurn] = useState(1);

    const addPlayer = (newPlayer: any) => {
        setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
    };

    // Add a new Enemy to the enemies array
    const addEnemy = (newEnemy: any) => {
        setEnemies(prevEnemies => [...prevEnemies, newEnemy]);
    };

    return (
        <div>
            <h1 className={styles.roomNumber}>Floor {floorNum}</h1>
            <h1 className={styles.roomNumber}>Room {roomNum}</h1>

            <div className={styles.mainContainer}>
                <div className={styles.enemiesContainer}>
                    {enemies.map((enemy, index) => (
                        <EnemyCard key={index} enemy={enemy} styles={styles} />
                    ))}
                </div>

                <div className={styles.playersContainer}>
                    {players.map((player, index) => (
                        <PlayerCard
                            key={index}
                            player={player}
                            enemies={enemies}
                            styles={styles}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default rooms