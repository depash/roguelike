export class Enemy {
    constructor(name, level, baseHealth, baseAttack, baseDefense, minGold, maxGold, minExp, maxExp, currentHealth = null, diffucilty) {
        this.baseName = name;
        this.level = level;
        this.baseHealth = baseHealth;
        this.baseAttack = baseAttack;
        this.baseDefense = baseDefense;
        this.baseMinGold = minGold;
        this.baseMaxGold = maxGold;
        this.baseMinExp = minExp;
        this.baseMaxExp = maxExp;
        this.currentHealth = currentHealth !== null ? currentHealth : this.maxHealth;
        this.diffucilty = diffucilty;
    }

    get name() {
        return `${this.baseName} Lv.${this.level}`;
    }

    // +10 HP per level
    get maxHealth() {
        return this.baseHealth + (this.level - 1) * 10;
    }

    // +2 attack per level
    get attack() {
        return this.baseAttack + (this.level - 1) * 2;
    }

    // +1 defense per level
    get defense() {
        return this.baseDefense + (this.level - 1) * 1;
    }

    // +2 minimum gold per level
    get minGold() {
        return this.baseMinGold + (this.level - 1) * 2;
    }

    // +5 maximum gold per level
    get maxGold() {
        return this.baseMaxGold + (this.level - 1) * 5;
    }

    // +3 minimum EXP per level
    get minExp() {
        return this.baseMinExp + (this.level - 1) * 3;
    }

    // +7 maximum EXP per level
    get maxExp() {
        return this.baseMaxExp + (this.level - 1) * 7;
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


    die() {
        const goldDropped = Math.floor(Math.random() * (this.maxGold - this.minGold + 1)) + this.minGold;
        const expGained = Math.floor(Math.random() * (this.maxExp - this.minExp + 1)) + this.minExp;
        return { gold: goldDropped, exp: expGained };
    }
}

class Goblin extends Enemy {
    constructor(level) {
        super("Goblin", level, 50, 3, 1, 5, 15, 10, 20, 1);
        // (name, level, baseHealth, baseAttack, baseDefense, minGold, maxGold, minExp, maxExp)
    }
}

class Orc extends Enemy {
    constructor(level) {
        super("Orc", level, 80, 5, 3, 10, 25, 15, 30);
    }
}

class Troll extends Enemy {
    constructor(level) {
        super("Troll", level, 120, 7, 5, 15, 30, 20, 40);
    }
}

class Skeleton extends Enemy {
    constructor(level) {
        super("Skeleton", level, 70, 4, 2, 7, 20, 12, 25);
    }
}

class Bandit extends Enemy {
    constructor(level) {
        super("Bandit", level, 90, 6, 2, 12, 28, 18, 35);
    }
}

class Witch extends Enemy {
    constructor(level) {
        super("Witch", level, 60, 8, 1, 18, 35, 22, 45);
    }
}

//imps with demons
class Demon extends Enemy {
    constructor(level) {
        super("Demon", level, 150, 10, 6, 25, 50, 30, 60);
    }
}

class Slimes extends Enemy {
    constructor(level) {
        super("Slimes", level, 150, 10, 6, 25, 50, 30, 60);
    }
}

// final boss be dragon

// Array of all enemy classes
const allEnemies = [Goblin, Orc, Troll, Skeleton, Bandit, Witch, Demon, Slimes];

// Generate enemy of random type with level scaled based on player level
export function generateEnemyBasedOnPlayerLevel(playerLevel) {
    const enemyLevel = playerLevel;

    // generate number of enemies based on player level and difficulty

    const EnemyClass = allEnemies[Math.floor(Math.random() * allEnemies.length)];

    return new EnemyClass(enemyLevel);
}