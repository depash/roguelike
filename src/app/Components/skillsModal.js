import styles from "./skillsModal.module.css";

export const SkillsModal = ({ player, closeSkills, cooldowns, handleAttackClicked, handleHealClicked, handleBuffClicked, handleEffectClicked, playerIndex }) => {
    return (
        <>
            <div className={styles.modalBackdrop} onClick={closeSkills}></div>
            <div className={styles.skillsModalInline}>
                <h2 className={styles.skillsHeader}>Skills</h2>
                <ul className={styles.skillsList}>
                    {player.skills.map((skill, index) => (
                        <li key={index} className={styles.skillItem} onClick={(e) => {
                            e.stopPropagation();
                            if (skill.type === 'attack') {
                                const turnsLeft = cooldowns.get(skill.name);
                                if (turnsLeft === undefined) {
                                    handleAttackClicked(skill.damage, skill.aoe, skill);
                                    closeSkills();
                                }
                                else {
                                    alert(`Skill ${skill.name} is on cooldown for ${turnsLeft} turns!`);
                                }
                            }
                            else if (skill.type === 'heal') {
                                const turnsLeft = cooldowns.get(skill.name);
                                if (turnsLeft === undefined) {
                                    handleHealClicked(skill);
                                    closeSkills();
                                }
                                else {
                                    alert(`Skill ${skill.name} is on cooldown for ${turnsLeft} turns!`);
                                }
                            }
                            else if (skill.type === 'effect') {
                                const turnsLeft = cooldowns.get(skill.name);
                                if (turnsLeft === undefined) {
                                    handleEffectClicked(skill);
                                    closeSkills();
                                } else {
                                    alert(`Skill ${skill.name} is on cooldown for ${turnsLeft} turns!`);
                                }
                            } else if (skill.type === 'buff') {
                                const turnsLeft = cooldowns.get(skill.name);
                                if (turnsLeft === undefined) {
                                    handleBuffClicked(skill, playerIndex);
                                    closeSkills();
                                } else {
                                    alert(`Skill ${skill.name} is on cooldown for ${turnsLeft} turns!`);
                                }
                            }
                        }}>
                            {skill.name}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

