import styles from "./enemyCard.module.css";
import shared from "./shared.module.css";

type Enemy = {
    name: string;
    level: number;
    currentHealth: number;
    maxHealth: number;
    attack: number;
    defense: number;
    isAlive: boolean;
    effects: Map<string, number>;
};

interface EnemyCardProps {
    enemyIndex: number;
    enemy: Enemy;
    actionType: string;
    handleEnemyTargetedSkill: (enemyIndex: number) => void;
    aoe?: boolean;
}

export const EnemyCard = ({ enemyIndex, enemy, actionType, handleEnemyTargetedSkill, aoe }: EnemyCardProps) => {
    const healthPercent = enemy.currentHealth / enemy.maxHealth;
    let healthColor = "#00cc66";
    if (healthPercent <= 0.5) healthColor = "#ffcc00";
    if (healthPercent <= 0.25) healthColor = "#e63946";

    const canTargetEnemy = (enemy: Enemy) => {
        return enemy.isAlive && (actionType === "attack" || actionType === "effect");
    };

    const effectIcons = {
        poison: "🧪",
        stun: "💫",
        taunt: "💢",
        defensedebuff: <span style={{ color: 'red' }}>⛨</span>,
    };

    return (
        <div
            className={[
                styles.individualEnemyContainer,
                canTargetEnemy(enemy) && (aoe ? styles.enemySelectableAoe : styles.enemySelectable),
                !enemy.isAlive && styles.enemyDead
            ].filter(Boolean).join(" ")}
            onClick={() => {
                if (canTargetEnemy(enemy)) {
                    handleEnemyTargetedSkill(enemyIndex);
                }
            }}
        >
            <h1>
                Enemy: {enemy.name}
                {enemy.effects.size > 0 && (
                    <div className={styles.effectsContainer}>
                        {[...enemy.effects.entries()].map(([effectName, duration]) => (
                            <div
                                key={effectName}
                                className={styles.effectIconWrapper}
                                title={`${effectName.charAt(0).toUpperCase() + effectName.slice(1)} (${duration} turns)`}
                            >
                                <span className={styles.effectIcon}>
                                    {effectIcons.hasOwnProperty(effectName.toLowerCase())
                                        ? effectIcons[effectName.toLowerCase() as keyof typeof effectIcons]
                                        : effectName}
                                </span>
                                <span className={styles.effectDuration}>{duration}</span>
                            </div>
                        ))}
                    </div>
                )}
            </h1>
            <p>Level: {enemy.level}</p>
            <div className={shared.healthBarContainer}>
                <span className={shared.healthBarLabel}>HP</span>
                <div className={shared.healthBarWrapper}>
                    <div
                        className={shared.healthBarProgress}
                        style={{
                            width: `${healthPercent * 100}%`,
                            backgroundColor: healthColor,
                        }}
                    ></div>
                </div>
                <span className={shared.healthNumbers}>
                    {enemy.currentHealth} / {enemy.maxHealth}
                </span>
            </div>
            <p>Attack: {enemy.attack}</p>
            <p>Defense: {enemy.defense}</p>
        </div>
    );
};