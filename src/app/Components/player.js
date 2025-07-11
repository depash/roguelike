export class Player {
    constructor(name, level = 1, baseHealth = 100, baseAttack = 5, baseDefense = 2, gold = 0, exp = 0, currentHealth = null) {
        this.name = name;
        this.level = level;
        this.baseHealth = baseHealth;
        this.baseAttack = baseAttack;
        this.baseDefense = baseDefense;
        this.gold = gold;
        this.exp = exp;
        this.nextLevelExp = 50;
        this.currentHealth = currentHealth !== null ? currentHealth : this.maxHealth;
    }

    get maxHealth() {
        return this.baseHealth + (this.level - 1) * 20;
    }

    get attack() {
        return this.baseAttack + (this.level - 1) * 2;
    }

    get defense() {
        return this.baseDefense + (this.level - 1) * 1;
    }

    get isAlive() {
        return this.currentHealth > 0;
    }


    clone() {
        return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    }

    takeDamage(damage) {
        const clone = this.clone();
        clone.currentHealth -= damage;
        return clone;
    }

    levelUp() {
        const clone = this.clone();
        clone.exp = 0;
        clone.level++;
        clone.currentHealth = clone.maxHealth;
        return clone;
    }
}