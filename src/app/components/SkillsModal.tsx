import styles from "./skillsModal.module.css";

type Skill = {
    name: string;
    type: 'attack' | 'heal' | 'effect' | 'buff';
    damage?: number;
    aoe?: boolean;
};

type Player = {
    skills: Skill[];
};

type SkillsModalProps = {
    player: Player;
    closeSkills: () => void;
    cooldowns: Map<string, number>;
    handleAttackClicked: (damage: number, aoe: boolean, skill: Skill) => void;
    handleHealClicked: (skill: Skill) => void;
    handleBuffClicked: (skill: Skill, playerIndex: number) => void;
    handleEffectClicked: (skill: Skill) => void;
    playerIndex: number;
};

export const SkillsModal = ({
    player,
    closeSkills,
    cooldowns,
    handleAttackClicked,
    handleHealClicked,
    handleBuffClicked,
    handleEffectClicked,
    playerIndex
}: SkillsModalProps) => {
    return (
        <>
            <div className={styles.modalBackdrop} onClick={closeSkills}></div>
            <div className={styles.skillsModalInline}>
                <h2 className={styles.skillsHeader}>Skills</h2>
                <ul className={styles.skillsList}>
                    {player.skills.map((skill, index) => {
                        const turnsLeft = cooldowns.get(skill.name);
                        const onCooldown = turnsLeft !== undefined;
                        return (
                            <li
                                key={index}
                                className={`${styles.skillItem} ${onCooldown ? styles.skillOnCooldown : ""}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (onCooldown) {
                                        return;
                                    }
                                    if (skill.type === 'attack') handleAttackClicked(skill.damage ?? 0, skill.aoe ?? false, skill);
                                    else if (skill.type === 'heal') handleHealClicked(skill);
                                    else if (skill.type === 'effect') handleEffectClicked(skill);
                                    else if (skill.type === 'buff') handleBuffClicked(skill, playerIndex);

                                    closeSkills();
                                }}
                            >
                                {skill.name}
                                {onCooldown && <span className={styles.cooldownTimer}> ({turnsLeft})</span>}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
};