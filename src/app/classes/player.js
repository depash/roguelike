export class Player {
    constructor(name, level = 1, baseHealth = 100, baseAttack = 5, baseDefense = 2, gold = 0, exp = 0, currentHealth = null, bonusAttack = 0, bonusDefense = 0) {
        this.name = name;
        this.level = level;
        this.baseHealth = baseHealth;
        this.baseAttack = baseAttack;
        this.baseDefense = baseDefense;
        this.bonusAttack = bonusAttack;
        this.bonusDefense = bonusDefense;
        this.gold = gold;
        this.exp = exp;
        this.nextLevelExp = 50;
        this.currentHealth = currentHealth !== null ? currentHealth : this.maxHealth;
    }

    get maxHealth() {
        return this.baseHealth + (this.level - 1) * this.healthPerLevel();
    }

    get attack() {
        return this.baseAttack + (this.level - 1) * this.attackPerLevel() + this.bonusAttack;
    }

    get defense() {
        return this.baseDefense + (this.level - 1) * this.defensePerLevel() + this.bonusDefense;
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
        clone.currentHealth += heal;
        if (clone.currentHealth > clone.maxHealth) {
            clone.currentHealth = clone.maxHealth;
        }
        return clone;
    }

    addBuff({ attack = 0, defense = 0 }) {
        this.bonusAttack += attack;
        this.bonusDefense += defense;
    }

    clearBuffs() {
        this.bonusAttack = 0;
        this.bonusDefense = 0;
    }

    levelUp() {
        const clone = this.clone();
        clone.exp = 0;
        clone.level++;
        clone.currentHealth = clone.maxHealth;
        return clone;
    }
}