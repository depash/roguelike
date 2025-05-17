class Enemy {
    constructor(name, level, baseHealth, baseAttack, baseDefense, minGold, maxGold) {
        this.name = `${name} Lv.${level}`;
        this.level = level;
        this.health = baseHealth + (level - 1) * 10;    // +10 HP per level
        this.attack = baseAttack + (level - 1) * 2;     // +2 ATK per level
        this.defense = baseDefense + (level - 1) * 1;   // +1 DEF per level
        this.minGold = minGold + (level - 1) * 2;       // +2 gold min per level
        this.maxGold = maxGold + (level - 1) * 5;       // +5 gold max per level
        this.minExp = minExp + (level - 1) * 3;         // +3 exp per level
        this.maxExp = maxExp + (level - 1) * 7;         // +7 exp per level
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            return this.die();
        }
        return 0;
    }

    die() {
        const goldDropped = Math.floor(Math.random() * (this.maxGold - this.minGold + 1)) + this.minGold;
        const expGained = Math.floor(Math.random() * (this.maxExp - this.minExp + 1)) + this.minExp;
        return { gold: goldDropped, exp: expGained };
    }
}

class Goblin extends Enemy {
    constructor(level) {
        super("Goblin", level, 50, 3, 1, 5, 15, 10, 20);
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

class Demon extends Enemy {
    constructor(level) {
        super("Demon", level, 150, 10, 6, 25, 50, 30, 60);
    }
}

// Array of all enemy classes
const allEnemies = [Goblin, Orc, Troll, Skeleton, Bandit, Witch, Demon];

// Generate enemy of random type with level scaled based on player level
export function generateEnemyBasedOnPlayerLevel(playerLevel) {
    const enemyLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 3) - 1);

    const EnemyClass = allEnemies[Math.floor(Math.random() * allEnemies.length)];

    return new EnemyClass(enemyLevel);
}