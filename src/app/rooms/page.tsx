"use client";
import React, { useEffect, useRef, useState } from 'react'
import styles from "./page.module.css";
import { Player } from '../classes/player'
import { Enemy, generateEnemyGroup } from '../classes/enemies'
import { EnemyCard } from '../components/EnemyCard';
import { PlayerCard } from '../components/PlayerCard';
import { Warrior, Healer, Mage, Rogue } from '../classes/subClasses';

// mabey big boss at the end of each 25 rooms before endless mode of some kind
// get random allie as the rooms go on
// add diffrent fonts to players and enemies
// mabey adding shop or rest area to spend gold

// adding sounds of combat
// add images to enimies and players
const rooms = () => {
    const classes = [Warrior, Healer, Mage, Rogue];
    const initiativeOrder = useRef<(Player)[]>([]);
    type ActionType = "attack" | "heal" | "effect" | "buff" | "none";

    const [players, setPlayers] = useState(() => {
        return classes.map(PlayerClass => new PlayerClass());
    });

    const [enemies, setEnemies] = useState(generateEnemyGroup(players[0].level, 1));
    const [roomNum, setRoomNum] = useState(1);
    const [floorNum, setFloorNum] = useState(1);
    const [currentPlayer, setCurrentPlayer] = useState<Player | undefined>(undefined);
    const [cooldowns, setCooldowns] = useState(new Map<string, number>());
    const [actionType, setActionType] = useState<ActionType>("none");
    const [damage, setDamage] = useState<number | undefined>();
    const [healAmount, setHealAmount] = useState<number | undefined>();
    const [skillMeta, setSkillMeta] = useState<{
        name: string;
        cooldown: number;
        turns?: number;
        attack?: number;
        defense?: number;
        target?: string;
        effectType?: string;
        ignoresDefense?: boolean;
    } | null>(null);
    const [aoe, setAoe] = useState<boolean>(false);
    const aliveEnemies = useRef<Enemy[]>([...enemies]);
    const [floorOptions, setFloorOptions] = useState<String[]>([]);
    const [choosingFloor, setChoosingFloor] = useState(false);

    const generateInitiativeOrder = (players: Player[]) => {
        const allCharacters = [...players];
        initiativeOrder.current = allCharacters.filter(p => p.isAlive);

        if (!initiativeOrder.current.length) {
            alert("All players are dead! Game Over!");
            window.location.href = "/";
            return;
        }

        setCurrentPlayer(initiativeOrder.current[0]);
    };

    const nextPlayerTurn = (enemies: Enemy[], players: Player[]) => {
        initiativeOrder.current = initiativeOrder.current.filter(p => p !== currentPlayer);

        const enemiesWithEffectsApplied = enemies.map(e => {
            if (e.isAlive) {
                return e.applyEffects();
            }
            return e;
        });

        const alivePlayers = players.filter(p => p.isAlive);

        if (initiativeOrder.current.length) {
            setCurrentPlayer(initiativeOrder.current[0]);
        } else {
            const damagedPlayers = [...players];

            const warrior = alivePlayers.find(p => p.name === "Warrior");

            for (const enemy of enemiesWithEffectsApplied) {
                if (enemy.hasEffect("stun")) continue;

                let target: Player | undefined;

                if (enemy.hasEffect("taunt") && warrior) {
                    target = warrior;
                } else {
                    const randomIndex = Math.floor(Math.random() * alivePlayers.length);
                    target = alivePlayers[randomIndex];
                }

                if (target) {
                    const targetIndex = players.findIndex(p => p.name === target!.name);
                    damagedPlayers[targetIndex] = damagedPlayers[targetIndex].takeDamage(
                        enemy.attack - damagedPlayers[targetIndex].defense
                    );
                }
            }

            setCooldowns(prev => {
                const newMap = new Map<string, number>();
                for (const [skill, value] of prev.entries()) {
                    const newValue = value - 1;
                    if (newValue > 0) {
                        newMap.set(skill, newValue);
                    }
                }
                return newMap;
            });

            const updatedEnemies = enemiesWithEffectsApplied.map(e => e.tickEffects());
            aliveEnemies.current = updatedEnemies.filter(e => e.isAlive);
            const updatedPlayers = damagedPlayers.map(player => player.tickBuffs());
            setPlayers(updatedPlayers);
            setEnemies(updatedEnemies);

            generateInitiativeOrder(updatedPlayers);
        }

        if (!aliveEnemies.current.length) {
            const isFinalRoom = roomNum % (floorNum * 5) === 0;
            const newRoomNum = isFinalRoom ? 1 : roomNum + 1;
            const newFloorNum = isFinalRoom ? floorNum + 1 : floorNum;

            setRoomNum(newRoomNum);
            setFloorNum(newFloorNum);
            setChoosingFloor(true);
        }
    };

    const handleAttackClicked = (damage: number, aoe: boolean, skill: any) => {
        setActionType("attack");
        setDamage(damage);
        setAoe(aoe);
        setHealAmount(undefined);

        if (skill) {
            setSkillMeta({ name: skill.name, cooldown: skill.cooldown, ignoresDefense: skill.ignoresDefense ?? false });
        } else {
            setSkillMeta(null);
        }
    };

    const handleHealClicked = (skill: any) => {
        setActionType("heal");
        setHealAmount(skill.healing);
        setAoe(skill.aoe);
        setDamage(undefined);

        setSkillMeta({ name: skill.name, cooldown: skill.cooldown });
    };

    const handleEffectClicked = (skill: any) => {
        setActionType("effect");

        setDamage(skill.damage ?? undefined);
        setHealAmount(undefined);
        setAoe(skill.aoe ?? false);

        setSkillMeta({
            name: skill.name,
            cooldown: skill.cooldown ?? 0,
            turns: skill.turns ?? 1,
            effectType: skill.effectType ?? skill.name.toLowerCase(),
        });
    };

    const handleBuffClicked = (skill: any, playerIndex: number) => {
        const updatedPlayers = [...players];
        const skillBuff = {
            duration: skill.turns ?? 1,
            attack: skill.attackPercent ?? 0,
            defense: skill.defensePercent ?? 0,
        };

        updatedPlayers[playerIndex] = updatedPlayers[playerIndex].addBuff(skill.name, skillBuff);

        if (skill.cooldown !== undefined) {
            setCooldowns(prev => {
                const newMap = new Map(prev);
                newMap.set(skill.name, skill.cooldown);
                return newMap;
            });
        }

        setPlayers(updatedPlayers);
        setActionType("none");
        nextPlayerTurn(enemies, updatedPlayers);
    };

    const handlePlayerHeal = (index: number) => {
        let updatedPlayers = [...players];

        const isResurrect = skillMeta?.name?.toLowerCase() === "resurrect";

        if (skillMeta) {
            setCooldowns(prev => {
                const newMap = new Map(prev);
                newMap.set(skillMeta.name, skillMeta.cooldown);
                return newMap;
            });
        }

        if (aoe) {
            updatedPlayers = updatedPlayers.map(player =>
                player.isAlive ? player.heal(healAmount) : player
            );
        } else {
            const targetPlayer = players[index];

            if (isResurrect && !targetPlayer.isAlive) {
                const healAmount = Math.ceil(targetPlayer.maxHealth * 0.25);
                updatedPlayers[index].currentHealth = healAmount;
            } else if (targetPlayer.isAlive) {
                updatedPlayers[index] = targetPlayer.heal(healAmount);
            }
        }

        setPlayers(updatedPlayers);
        setActionType("none");
        setHealAmount(undefined);
        nextPlayerTurn(enemies, updatedPlayers);
    };


    const handleEnemyTargetedSkill = (index: number) => {
        let updatedEnemies = [...enemies];
        let updatedPlayers = [...players];
        let totalGold = 0;
        let totalExp = 0;

        const hasEffect = skillMeta && skillMeta.effectType && skillMeta.turns !== undefined;

        if (skillMeta) {
            setCooldowns(prev => {
                const newMap = new Map(prev);
                newMap.set(skillMeta.name, skillMeta.cooldown);
                return newMap;
            });
        }

        const applyToEnemy = (enemy: Enemy): Enemy => {
            if (!enemy.isAlive) return enemy;

            let updated = enemy;

            if (typeof damage === "number") {
                const ignoresDefense = skillMeta?.ignoresDefense === true;
                const finalDamage = ignoresDefense
                    ? damage
                    : Math.max(damage - enemy.defense, 0);
                updated = updated.takeDamage(finalDamage);
            }

            if (hasEffect && updated.isAlive) {
                updated = updated.addEffect({
                    name: skillMeta.effectType,
                    duration: skillMeta.turns,
                });
            }

            if (!updated.isAlive) {
                const { gold, exp } = enemy.die();
                totalGold += gold;
                totalExp += exp;
            }

            return updated;
        };

        if (aoe) {
            updatedEnemies = updatedEnemies.map(applyToEnemy);
        } else {
            if (updatedEnemies[index].isAlive) {
                updatedEnemies[index] = applyToEnemy(updatedEnemies[index]);
            }
        }

        aliveEnemies.current = updatedEnemies.filter(e => e.isAlive);

        if (totalGold > 0 || totalExp > 0) {
            const updatedPlayers = players.map(player => {
                let updated = player;
                updated.gold += totalGold;
                updated.exp += totalExp;
                if (updated.exp >= updated.nextLevelExp) {
                    updated = updated.levelUp();
                }
                return updated;
            });

            setPlayers(updatedPlayers);
        }

        setEnemies(updatedEnemies);
        setActionType("none");
        setDamage(undefined);
        nextPlayerTurn(updatedEnemies, updatedPlayers);
    };

    const handleFloorChoice = (choice: string) => {
        let difficulty = Math.min(25, floorNum * 2 + Math.floor(roomNum / 2));
        const isFinalRoom = roomNum % (floorNum * 5) === 0;

        if (choice === "elite") difficulty += 3;

        if (choice === "mystery") {
            const mystery = ["heal", "trap", "buff", "elite"][Math.floor(Math.random() * 4)];
            handleFloorChoice(mystery);
            return;
        }

        if (choice === "trap") {
            const trapDamage = Math.min(15 + (floorNum * 5), 80);
            setPlayers(prev => prev.map(p => (!p.isAlive ? p : p.takeDamage(trapDamage))));
        }

        if (choice === "buff") {
            setPlayers(prev => prev.map(p =>
                p
                    .addBuff("Bulwark", { duration: 3, defense: 0.4 })
                    .addBuff("Arcane Empowerment", { duration: 3, attack: 0.2 })
            ));
        }

        if (choice === "heal") {
            setPlayers(prev => prev.map(p => p.heal(p.maxHealth)));
        }

        if (["trap", "buff", "heal"].includes(choice)) {
            const newRoomNum = isFinalRoom ? 1 : roomNum + 1;
            const newFloorNum = isFinalRoom ? floorNum + 1 : floorNum;

            setRoomNum(newRoomNum);
            setFloorNum(newFloorNum);
            setTimeout(() => setChoosingFloor(true), 300);
            setChoosingFloor(false);
            return;
        }

        let newEnemies: Enemy[] = [];
        if (choice === "miniboss") {
            newEnemies = generateEnemyGroup(players[0].level, difficulty, true, floorNum);
        } else if (choice === "finalboss") {
            newEnemies = generateEnemyGroup(players[0].level, difficulty + 5, true, floorNum);
        } else if (choice === "normal" || choice === "elite") {
            newEnemies = generateEnemyGroup(players[0].level, difficulty, isFinalRoom, floorNum);
        }

        if (newEnemies.length > 0) {
            setEnemies(newEnemies);
            aliveEnemies.current = newEnemies;
            generateInitiativeOrder(players);
        }

        setChoosingFloor(false);
    };

    useEffect(() => {
        if (choosingFloor) {
            const options: string[] = [];
            const isFinalRoom = roomNum % (floorNum * 5) === 0;
            const isFinalBoss = floorNum === 25 && isFinalRoom;

            if (isFinalRoom) {
                options.push(isFinalBoss ? "finalboss" : "miniboss");
            } else {
                const typesWithWeight = [
                    ...Array(4).fill("normal"),
                    ...Array(2).fill("elite"),
                    "heal",
                    "trap",
                    "buff",
                    "mystery",
                ];

                while (options.length < 2) {
                    const rand = typesWithWeight[Math.floor(Math.random() * typesWithWeight.length)];
                    if (!options.includes(rand)) options.push(rand);
                }
            }

            setFloorOptions(options);
        }
        generateInitiativeOrder(players);
    }, [choosingFloor]);

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
                            handleEnemyTargetedSkill={handleEnemyTargetedSkill}
                            aoe={aoe}
                        />
                    ))}
                </div>

                {choosingFloor && (
                    <div className={styles.floorChoiceOverlay}>
                        <h2>Choose Your Next Room</h2>
                        <div className={styles.floorChoiceButtons}>
                            {floorOptions.map((option) => {
                                const key = option.toString();
                                const labelMap: Record<string, string> = {
                                    normal: "Normal Battle",
                                    elite: "Elite Battle (Extra Rewards)",
                                    heal: "Healing Spring",
                                    miniboss: "Miniboss Challenge",
                                    finalboss: "Final Boss",
                                    trap: "Trap Room (Takes Damage)",
                                    buff: "Buff Room (Gain Buffs)",
                                    mystery: "??? Mystery Room",
                                };

                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleFloorChoice(key)}
                                        className={`${styles.floorButton} 
                                        ${['heal', 'buff'].includes(key) ? styles.positive : ''} 
                                        ${['miniboss', 'finalboss'].includes(key) ? styles.danger : ''}
                                        ${['trap'].includes(key) ? styles.trap : ''}
                                        ${['mystery'].includes(key) ? styles.mystery : ''}
                                    `}>
                                        {labelMap[key] || key}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className={styles.playersContainer}>
                    {players.map((player, index) => (
                        <PlayerCard
                            key={index}
                            playerIndex={index}
                            player={player}
                            currentPlayer={currentPlayer?.name === player.name}
                            handleAttackClicked={handleAttackClicked}
                            cooldowns={cooldowns}
                            actionType={actionType}
                            handleHealClicked={handleHealClicked}
                            handlePlayerHeal={handlePlayerHeal}
                            handleBuffClicked={handleBuffClicked}
                            handleEffectClicked={handleEffectClicked}
                            aoe={aoe}
                            skillMeta={skillMeta}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default rooms