"use client";
import React, { useEffect, useRef, useState } from 'react'
import styles from "./page.module.css";
import { Player } from '../Components/player.js'
import { Enemy, generateEnemyBasedOnPlayerLevel } from '../Components/enemies.js'
import { EnemyCard } from '../Components/EnemyCard.js';
import { PlayerCard } from '../Components/PlayerCard.js';
import { Warrior, Healer, Mage, Rogue } from '../Components/subClasses.js';
import next from 'next';

// mabey big boss at the end of each 25 rooms before endless mode of some kind
// get random allie as the rooms go on
// add diffrent fonts to players and enemies
// mabey adding shop or rest area to spend gold

// adding sounds of combat
// add images to enimies and players
// floors that be what determines allies being added or rest spot
const rooms = () => {
    const classes = [Warrior, Healer, Mage, Rogue];
    const availableClasses = useRef([...classes]);
    const initiativeOrder = useRef<(Player)[]>([]);

    /*
    const [players, setPlayers] = useState(() => {
        const classes = availableClasses.current;
        const selectedIndex = Math.floor(Math.random() * classes.length);
        const PlayerClass = classes[selectedIndex];
        classes.splice(selectedIndex, 1);
        availableClasses.current = classes;
        return [new PlayerClass()];
    });
    */

    const [players, setPlayers] = useState(() => {
        return classes.map(PlayerClass => new PlayerClass());
    });

    const [enemies, setEnemies] = useState([generateEnemyBasedOnPlayerLevel(1), generateEnemyBasedOnPlayerLevel(1), generateEnemyBasedOnPlayerLevel(1), generateEnemyBasedOnPlayerLevel(1)]);
    const [roomNum, setRoomNum] = useState(1);
    const [floorNum, setFloorNum] = useState(1);
    const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(undefined);
    const [attacking, setAttacking] = useState(false);
    const [atackingPlayer, setAtackingPlayer] = useState<Player | undefined>(undefined);

    const aliveEnemies = useRef<Enemy[]>([...enemies]);

    const addPlayer = () => {
        const classes = availableClasses.current;
        if (classes.length === 0) return;
        let selectedClass = Math.floor(Math.random() * classes.length);
        let newClass = new classes[selectedClass]();
        classes.splice(selectedClass, 1);
        availableClasses.current = classes;
        setPlayers(prevPlayers => [...prevPlayers, newClass]);
    };

    const generateInitiativeOrder = () => {
        const allCharacters = [...players];
        initiativeOrder.current = allCharacters;
        setCurrentPlayer(initiativeOrder.current[0]);
    };

    const nextPlayerTurn = () => {
        initiativeOrder.current = initiativeOrder.current.filter(p => p !== currentPlayer);

        if (initiativeOrder.current.length) {
            setCurrentPlayer(initiativeOrder.current[0]);
        }
        else {
            generateInitiativeOrder();
        }

        if (aliveEnemies.current.length > 0) {
            //TODO: add enemy turn
        }
        else {
            setRoomNum(prevRoomNum => prevRoomNum + 1);
            if (roomNum % (floorNum * 5) === 0) {
                setFloorNum(prevFloorNum => prevFloorNum + 1);
                setRoomNum(1)
            }
            setEnemies([generateEnemyBasedOnPlayerLevel(players[0].level), generateEnemyBasedOnPlayerLevel(players[0].level), generateEnemyBasedOnPlayerLevel(players[0].level), generateEnemyBasedOnPlayerLevel(players[0].level)]);
            aliveEnemies.current = [...enemies];
        }
    };

    const handleAttackClicked = (player: Player) => {
        setAttacking(true);
        setAtackingPlayer(player)
    };

    const handleEnemyAttack = (enemy: Enemy, index: number) => {
        const updatedEnemy = enemies[index].takeDamage(atackingPlayer?.attack);
        const updatedEnemies = [...enemies];
        updatedEnemies[index] = updatedEnemy;

        if (updatedEnemy.currentHealth <= 0) {
            const { gold, exp } = enemies[index].die();

            aliveEnemies.current = updatedEnemies.filter(e => e.isAlive);

            let updatedPlayers = players.map((player) => {
                let updatedPlayer = player;

                updatedPlayer.gold += gold;
                updatedPlayer.exp += exp;

                if (player.exp >= player.nextLevelExp) {
                    updatedPlayer = player.levelUp()
                }

                return updatedPlayer;
            });

            setPlayers([...updatedPlayers]);
        }

        setEnemies(updatedEnemies);
        setAtackingPlayer(undefined);
        setAttacking(false);
        nextPlayerTurn();
    };

    useEffect(() => {
        generateInitiativeOrder();
    }, []);

    return (
        <div>
            <h1 className={styles.roomNumber}>Floor {floorNum}</h1>
            <h1 className={styles.roomNumber}>Room {roomNum}</h1>

            <div className={styles.mainContainer}>
                <div className={styles.enemiesContainer}>
                    {enemies.map((enemy, index) => (
                        <EnemyCard key={index} enemyIndex={index} enemy={enemy} styles={styles} attacking={attacking} handleEnemyAttack={handleEnemyAttack} />
                    ))}
                </div>

                <div className={styles.playersContainer}>
                    {players.map((player, index) => (
                        <PlayerCard
                            key={index}
                            player={player}
                            enemies={enemies}
                            addPlayer={addPlayer}
                            styles={styles}
                            currentPlayer={currentPlayer?.name === player.name}
                            handleAttackClicked={handleAttackClicked}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default rooms