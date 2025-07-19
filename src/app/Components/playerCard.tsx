import React, { useState } from "react";
import { SkillsModal } from "./SkillsModal";
import styles from "./PlayerCard.module.css";
import shared from "./Shared.module.css";

type Skill = {
    name: string;
    type: 'attack' | 'heal' | 'effect' | 'buff';
    damage?: number;
    aoe?: boolean;
};

type PlayerCardProps = {
    player: any;
    playerIndex: number;
    currentPlayer: boolean;
    handleAttackClicked: (attack: number, aoe: boolean, skill: Skill) => void;
    cooldowns: any;
    actionType: string;
    handleHealClicked: any;
    handlePlayerHeal: (playerIndex: number) => void;
    handleBuffClicked: any;
    handleEffectClicked: any;
    aoe: boolean;
    skillMeta: any;
};

export const PlayerCard = ({
    player,
    playerIndex,
    currentPlayer,
    handleAttackClicked,
    cooldowns,
    actionType,
    handleHealClicked,
    handlePlayerHeal,
    handleBuffClicked,
    handleEffectClicked,
    aoe,
    skillMeta
}: PlayerCardProps) => {
    const [showSkills, setShowSkills] = useState(false);

    const openSkills = () => {
        setShowSkills(true);
    };

    const closeSkills = () => {
        setShowSkills(false);
    }

    const healthPercent = player.currentHealth / player.maxHealth;

    let healthColor = "#00cc66";
    if (healthPercent <= 0.5) healthColor = "#ffcc00";
    if (healthPercent <= 0.25) healthColor = "#e63946";

    const isResurrect = skillMeta?.name?.toLowerCase() === "resurrect";
    const isSelectableForRes = isResurrect && !player.isAlive && actionType === "heal";
    const isSelectableNormal = !isResurrect && player.isAlive && (actionType === "heal" || actionType === "buff");
    const shouldDimBecauseUnselectable = !isResurrect && player.isAlive && actionType === "heal" && !isSelectableNormal;

    const selectableClass = isSelectableForRes
        ? `${styles.healingSelectable} ${styles.resurrectSelectable}`
        : isSelectableNormal
            ? aoe
                ? styles.healingSelectableAoe
                : styles.healingSelectable
            : "";

    const isVisuallyDead = !player.isAlive && (!isResurrect || actionType !== "heal");

    const playerClasses = [
        styles.individualPlayerContainer,
        isVisuallyDead && styles.playerDead,
        shouldDimBecauseUnselectable && styles.dimUnselectable,
        currentPlayer && styles.currentPlayerContainer,
        selectableClass,
    ].filter(Boolean).join(" ");

    const buffIcons: Record<string, React.ReactElement> = {
        bulwark: <span style={{ color: "#4CAF50" }}>🛡️</span>,
        "arcane empowerment": <span>✨</span>,
    };

    return (
        <div
            className={playerClasses}
            onClick={() => {
                if (
                    actionType === "heal" &&
                    (
                        (isResurrect && !player.isAlive) ||
                        (!isResurrect && player.isAlive)
                    )
                ) {
                    handlePlayerHeal(playerIndex);
                }
            }}
            title={isResurrect && !player.isAlive ? "Click to resurrect" : undefined}
        >
            <div className={styles.playerInfo}>
                <h2>{player.name}</h2>
                <p>Level: {player.level}</p>
                <div className={styles.buffsContainer}>
                    {[...player.buffs.entries()].map(([buffName, buffData]) => (
                        <div
                            key={buffName}
                            className={styles.buffIconWrapper}
                            title={`${buffName.charAt(0).toUpperCase() + buffName.slice(1)} (${buffData.duration} turns)`}
                        >
                            <span className={styles.buffIcon}>
                                {buffIcons[(buffName as string).toLowerCase()]}
                            </span>
                            <span className={styles.buffDuration}>{buffData.duration}</span>
                        </div>
                    ))}
                </div>
                <div className={shared.healthBarContainer}>
                    <span className={shared.healthBarLabel}>HP</span>
                    <div className={shared.healthBarWrapper}>
                        <div
                            className={shared.healthBarProgress}
                            style={{
                                width: `${healthPercent * 100}%`,
                                backgroundColor: healthColor
                            }}
                        ></div>
                    </div>
                    <span className={shared.healthNumbers}>
                        {player.currentHealth} / {player.maxHealth}
                    </span>
                </div>
                <p>
                    Attack:{" "}
                    <span style={{ color: player.buffs.has("Arcane Empowerment") ? "#4CAF50" : "inherit" }}>
                        {player.attack}
                        {player.buffs.has("Arcane Empowerment") && " ↑"}
                    </span>
                </p>
                <p>
                    Defense:{" "}
                    <span style={{ color: player.buffs.has("Bulwark") ? "#4CAF50" : "inherit" }}>
                        {player.defense}
                        {player.buffs.has("Bulwark") && " ↑"}
                    </span>
                </p>
                <div className={styles.xpBarContainer}>
                    <span className={styles.xpBarLabel}>XP</span>
                    <div className={styles.xpBarWrapper}>
                        <div
                            className={styles.xpBarProgress}
                            style={{ width: `${(player.exp / player.nextLevelExp) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <p>Gold: {player.gold}</p>
            </div>
            <div className={styles.playerActions}>
                <button
                    className={styles.attackButton}
                    disabled={!currentPlayer}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAttackClicked(
                            player.attack,
                            false,
                            {
                                name: "Basic Attack",
                                type: "attack",
                                damage: player.attack,
                                aoe: false
                            }
                        );
                    }}
                >
                    Attack
                </button>

                <button
                    className={styles.skillsButton}
                    disabled={!currentPlayer}
                    onClick={(e) => {
                        e.stopPropagation();
                        openSkills();
                    }}
                >
                    Skills
                </button>

                {showSkills ?
                    <SkillsModal
                        player={player}
                        closeSkills={closeSkills}
                        cooldowns={cooldowns}
                        handleAttackClicked={handleAttackClicked}
                        handleHealClicked={handleHealClicked}
                        handleBuffClicked={handleBuffClicked}
                        handleEffectClicked={handleEffectClicked}
                        playerIndex={playerIndex}
                    /> : null}
            </div>
        </div>
    );
};