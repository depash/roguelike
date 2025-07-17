import styles from "./skillsModal.module.css";

export const SkillsModal = ({ player, closeSkills, handleAttackClicked, cooldowns, setCooldowns, handleHealClicked }) => {
    return (
        <>
            <div className={styles.modalBackdrop} onClick={closeSkills}></div>
            <div className={styles.skillsModalInline}>
                <h2 className={styles.skillsHeader}>Skills</h2>
                <ul className={styles.skillsList}>
                    {player.skills.map((skill, index) => (
                        <li key={index} className={styles.skillItem} onClick={() => {
                            if (skill.type === 'attack') {
                                let isOnCooldown = cooldowns.findIndex(cooldowns => cooldowns[skill.name]);
                                if (isOnCooldown === -1) {
                                    handleAttackClicked(skill.damage, skill.aoe, skill);
                                    closeSkills();
                                }
                                else {
                                    alert(`Skill ${skill.name} is on cooldown for ${cooldowns[isOnCooldown][skill.name]} turns!`);
                                }
                            }
                            else if (skill.type === 'heal') {
                                let isOnCooldown = cooldowns.findIndex(cooldowns => cooldowns[skill.name]);
                                if (isOnCooldown === -1) {
                                    handleHealClicked(skill);
                                    closeSkills();
                                }
                                else {
                                    alert(`Skill ${skill.name} is on cooldown for ${cooldowns[isOnCooldown][skill.name]} turns!`);
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

