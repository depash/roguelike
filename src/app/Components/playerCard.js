import { useState } from "react";
import { SkillsModal } from "./skillsModal";
import styles from "./playerCard.module.css";
import shared from "./shared.module.css";

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
    aoe
}) => {
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

    return (
        <div
            className={[
                styles.individualPlayerContainer,
                currentPlayer && styles.currentPlayerContainer,
                player.isAlive && (actionType === "heal" || actionType === "buff") && (aoe ? styles.healingSelectableAoe : styles.healingSelectable)
            ].filter(Boolean).join(" ")}
            onClick={() => {
                if (actionType === "heal" && player.isAlive) {
                    handlePlayerHeal(playerIndex);
                }
            }}
        >
            <div className={styles.playerInfo}>
                <h2>{player.name}</h2>
                <p>Level: {player.level}</p>
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
                <p>Attack: {player.attack}</p>
                <p>Defense: {player.defense}</p>
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
                        handleAttackClicked(player.attack, false);
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
                    /> : null}
            </div>
        </div>
    );
};