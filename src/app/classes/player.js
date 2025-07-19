export class Player {
    constructor(name, level = 1, baseHealth = 100, baseAttack = 5, baseDefense = 2, gold = 0, exp = 0, currentHealth = null, bonusAttack = 0, bonusDefense = 0) {
        this.name = name;
        this.level = level;
        this.baseHealth = baseHealth;
        this.baseAttack = baseAttack;
        this.baseDefense = baseDefense;
        this.gold = gold;
        this.exp = exp;
        this.nextLevelExp = 50;
        this.currentHealth = currentHealth !== null ? currentHealth : this.maxHealth;
        this.buffs = new Map();
    }

    get maxHealth() {
        return Math.ceil(this.baseHealth + (this.level - 1) * this.healthPerLevel());
    }

    get bonusAttack() {
        let total = 0;
        for (const buff of this.buffs.values()) {
            total += Math.ceil(this.baseAttack * (buff.attack || 0));
        }
        return total;
    }

    get bonusDefense() {
        let total = 0;
        for (const buff of this.buffs.values()) {
            total += Math.ceil(this.baseDefense * (buff.defense || 0));
        }
        return total;
    }

    get attack() {
        return Math.ceil(
            this.baseAttack + (this.level - 1) * this.attackPerLevel() + this.bonusAttack
        );
    }

    get defense() {
        return Math.ceil(
            this.baseDefense + (this.level - 1) * this.defensePerLevel() + this.bonusDefense
        );
    }

    get isAlive() {
        return this.currentHealth > 0;
    }

    healthPerLevel() { return 20; }
    attackPerLevel() { return 2; }
    defensePerLevel() { return 1; }

    clone() {
        return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    }

    takeDamage(damage) {
        const clone = this.clone();
        clone.currentHealth -= damage;
        return clone;
    }

    heal(heal) {
        const clone = this.clone();
        clone.currentHealth += Math.ceil(heal);
        if (clone.currentHealth > clone.maxHealth) {
            clone.currentHealth = clone.maxHealth;
        }
        return clone;
    }

    addBuff(name, { duration, attack = 0, defense = 0 }) {
        const clone = this.clone();
        clone.buffs.set(name, {
            duration,
            attack: Math.ceil(attack * 100) / 100,
            defense: Math.ceil(defense * 100) / 100
        });
        return clone;
    }

    tickBuffs() {
        const clone = this.clone();
        const newBuffs = new Map();

        for (const [name, buff] of this.buffs.entries()) {
            const newDuration = buff.duration - 1;
            if (newDuration > 0) {
                newBuffs.set(name, { ...buff, duration: newDuration });
            }
        }

        clone.buffs = newBuffs;
        return clone;
    }

    clearBuffs() {
        const clone = this.clone();
        clone.buffs = new Map();
        return clone;
    }

    levelUp() {
        const clone = this.clone();
        clone.exp = 0;
        clone.level++;
        return clone;
    }
}