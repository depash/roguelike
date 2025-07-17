"use client";
import React, { useEffect, useRef, useState } from 'react'
import styles from "./page.module.css";
import { Player } from '../classes/player.js'
import { Enemy, generateEnemyBasedOnPlayerLevel } from '../classes/enemies.js'
import { EnemyCard } from '../components/EnemyCard.js';
import { PlayerCard } from '../components/PlayerCard.js';
import { Warrior, Healer, Mage, Rogue } from '../classes/subClasses.js';
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
    type ActionType = "attack" | "heal" | "none";

    const [players, setPlayers] = useState(() => {
        return classes.map(PlayerClass => new PlayerClass());
    });

    const [enemies, setEnemies] = useState([generateEnemyBasedOnPlayerLevel(1), generateEnemyBasedOnPlayerLevel(1), generateEnemyBasedOnPlayerLevel(1), generateEnemyBasedOnPlayerLevel(1)]);
    const [roomNum, setRoomNum] = useState(1);
    const [floorNum, setFloorNum] = useState(1);
    const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(undefined);
    const [cooldowns, setCooldowns] = useState<{ [key: string]: number }[]>([]);
    const [actionType, setActionType] = useState<ActionType>("none");
    const [damage, setDamage] = useState<number | undefined>();
    const [healAmount, setHealAmount] = useState<number | undefined>();
    const [aoe, setAoe] = useState<boolean>(false);


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
            let enemyDamage = []
            for (let i = 0; i < aliveEnemies.current.length; i++) {
                const enemy = aliveEnemies.current[i];
                enemyDamage.push(enemy.attack);
            }

            const updatedPlayers = [...players];

            enemyDamage.forEach((damage) => {
                let randomPlayer = Math.floor(Math.random() * players.length);

                updatedPlayers[randomPlayer] = updatedPlayers[randomPlayer].takeDamage(damage);
            })

            setPlayers([...updatedPlayers]);

            const updated = cooldowns.map(obj => {
                const [skill, cooldown] = Object.entries(obj)[0];
                const newValue = (cooldown as number) - 1;
                return newValue > 0 ? { [skill]: newValue } : null;
            }).filter((item): item is { [key: string]: number } => item !== null);

            setCooldowns(updated);

            generateInitiativeOrder();
        }

        if (!aliveEnemies.current.length) {
            setRoomNum(prevRoomNum => prevRoomNum + 1);
            if (roomNum % (floorNum * 5) === 0) {
                setFloorNum(prevFloorNum => prevFloorNum + 1);
                setRoomNum(1)
            }
            setEnemies([generateEnemyBasedOnPlayerLevel(players[0].level), generateEnemyBasedOnPlayerLevel(players[0].level), generateEnemyBasedOnPlayerLevel(players[0].level), generateEnemyBasedOnPlayerLevel(players[0].level)]);
            aliveEnemies.current = [...enemies];
        }
    };

    const handleAttackClicked = (damage: number, aoe: boolean, skill?: any) => {
        setActionType("attack");
        setDamage(damage);
        setAoe(aoe);
        setHealAmount(undefined);

        if (skill) {
            setCooldowns(prev => [...prev, { [skill.name]: skill.cooldown }]);
        }
    };


    const handleHealClicked = (skill: any) => {
        setActionType("heal");
        setHealAmount(skill.healing);
        setAoe(skill.aoe);
        setDamage(undefined);

        setCooldowns(prev => [...prev, { [skill.name]: skill.cooldown }]);
    };


    const handleEnemyAttack = (index: number) => {
        let updatedEnemies = [...enemies];
        let totalGold = 0;
        let totalExp = 0;

        if (aoe) {
            updatedEnemies = updatedEnemies.map((enemy) => {
                if (!enemy.isAlive) return enemy;

                const damagedEnemy = enemy.takeDamage(damage);

                if (damagedEnemy.currentHealth <= 0) {
                    const { gold, exp } = enemy.die();
                    totalGold += gold;
                    totalExp += exp;
                    return { ...damagedEnemy, isAlive: false }; // assuming die() mutates
                }

                return damagedEnemy;
            });

            aliveEnemies.current = updatedEnemies.filter(e => e.isAlive);
        } else {
            const updatedEnemy = enemies[index].takeDamage(damage);
            updatedEnemies[index] = updatedEnemy;

            if (updatedEnemy.currentHealth <= 0) {
                const { gold, exp } = enemies[index].die();
                totalGold = gold;
                totalExp = exp;

                aliveEnemies.current = updatedEnemies.filter(e => e.isAlive);
            }
        }

        if (totalGold > 0 || totalExp > 0) {
            const updatedPlayers = players.map((player) => {
                let updatedPlayer = player;
                updatedPlayer.gold += totalGold;
                updatedPlayer.exp += totalExp;

                if (updatedPlayer.exp >= updatedPlayer.nextLevelExp) {
                    updatedPlayer = updatedPlayer.levelUp(); // ensure levelUp returns a new Player
                }

                return updatedPlayer;
            });

            setPlayers(updatedPlayers);
        }

        setEnemies(updatedEnemies);
        setActionType("none");
        setDamage(undefined);
        nextPlayerTurn();
    };

    const handlePlayerHeal = (index: number) => {
        let updatedPlayers = [...players];

        if (aoe) {
            updatedPlayers = updatedPlayers.map(player => {
                return player.isAlive ? player.heal(healAmount) : player;
            });
        } else {
            const playerToHeal = players[index];
            if (playerToHeal.isAlive) {
                updatedPlayers[index] = playerToHeal.heal(healAmount);
            }
        }

        setPlayers(updatedPlayers);
        setActionType("none");
        setHealAmount(undefined);
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
                        <EnemyCard
                            key={index}
                            enemyIndex={index}
                            enemy={enemy}
                            actionType={actionType}
                            handleEnemyAttack={handleEnemyAttack}
                            aoe={aoe}
                        />
                    ))}
                </div>

                <div className={styles.playersContainer}>
                    {players.map((player, index) => (
                        <PlayerCard
                            key={index}
                            playerIndex={index}
                            player={player}
                            enemies={enemies}
                            addPlayer={addPlayer}
                            currentPlayer={currentPlayer?.name === player.name}
                            handleAttackClicked={handleAttackClicked}
                            cooldowns={cooldowns}
                            setCooldowns={setCooldowns}
                            actionType={actionType}
                            handleHealClicked={handleHealClicked}
                            handlePlayerHeal={handlePlayerHeal}
                            aoe={aoe}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default rooms