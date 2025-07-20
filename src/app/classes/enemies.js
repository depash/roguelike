export class Enemy {
    constructor(name, level, baseHealth, baseAttack, baseDefense, minGold, maxGold, minExp, maxExp, currentHealth = null, difficulty) {
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
        this.effects = new Map();
    }

    get name() {
        return `${this.baseName} Lv.${this.level}`;
    }

    get maxHealth() {
        return this.level <= 3 ? Math.floor(this.baseHealth + (this.level - 1) * 8) : Math.floor(this.baseHealth + (this.level - 1) * 12);
    }

    get attack() {
        return this.level <= 3 ? Math.floor(this.baseAttack + (this.level - 1) * 1.5) : Math.floor(this.baseAttack + (this.level - 1) * 2.2);
    }

    get defense() {
        let defense = this.level <= 3 ? Math.floor(this.baseDefense + (this.level - 1) * 0.7) : Math.floor(this.baseDefense + (this.level - 1) * 1.1);
        if (this.hasEffect("defenseDebuff")) {
            defense = Math.floor(defense * 0.6);
        }
        return defense;
    }

    get minGold() {
        return Math.floor(this.baseMinGold + (this.level - 1) * 3);
    }

    get maxGold() {
        return Math.floor(this.baseMaxGold + (this.level - 1) * 6);
    }

    get minExp() {
        return Math.floor(this.baseMinExp + (this.level - 1) * 4);
    }

    get maxExp() {
        return Math.floor(this.baseMaxExp + (this.level - 1) * 9);
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

    addEffect(effect) {
        const clone = this.clone();
        clone.effects = new Map(this.effects);
        clone.effects.set(effect.name, effect.duration);
        return clone;
    }

    tickEffects() {
        const clone = this.clone();
        const newEffects = new Map();
        for (const [name, duration] of this.effects.entries()) {
            const newDuration = duration - 1;
            if (newDuration > 0) {
                newEffects.set(name, newDuration);
            }
        }
        clone.effects = newEffects;
        return clone;
    }

    applyEffects() {
        const clone = this.clone();
        for (const [name] of this.effects.entries()) {
            if (name === "poison") {
                const poisonDamage = Math.max(1, Math.floor(clone.currentHealth * 0.1));
                clone.currentHealth -= poisonDamage;
            }
        }
        return clone;
    }

    hasEffect(effectName) {
        return this.effects.has(effectName);
    }

    die() {
        const goldDropped = Math.floor(Math.random() * (this.maxGold - this.minGold + 1)) + this.minGold;
        const expGained = Math.floor(Math.random() * (this.maxExp - this.minExp + 1)) + this.minExp;
        return { gold: goldDropped, exp: expGained };
    }
}

class Goblin extends Enemy {
    constructor(level) {
        super("Goblin", level, 45, 4, 1, 5, 12, 8, 18);
    }
}

class Skeleton extends Enemy {
    constructor(level) {
        super("Skeleton", level, 55, 5, 2, 6, 14, 10, 20);
    }
}

class Orc extends Enemy {
    constructor(level) {
        super("Orc", level, 80, 7, 3, 10, 20, 15, 28);
    }
}

class Bandit extends Enemy {
    constructor(level) {
        super("Bandit", level, 75, 8, 2, 12, 22, 16, 30);
    }
}

class Troll extends Enemy {
    constructor(level) {
        super("Troll", level, 100, 9, 5, 15, 26, 18, 35);
    }
}

class Witch extends Enemy {
    constructor(level) {
        super("Witch", level, 65, 10, 2, 16, 28, 20, 38);
    }
}

class Demon extends Enemy {
    constructor(level) {
        super("Demon", level, 130, 12, 6, 20, 35, 24, 45);
    }
}

class Slimes extends Enemy {
    constructor(level) {
        super("Slimes", level, 140, 11, 5, 18, 34, 22, 44);
    }
}

class Miniboss extends Enemy {
    constructor(name, level, baseHealth, baseAttack, baseDefense) {
        super(name, level, baseHealth, baseAttack, baseDefense, 40, 80, 40, 80);
    }
}

class Ogre extends Miniboss {
    constructor(level) {
        super("Ogre Brute", level, 200, 15, 8);
    }
}

class DarkKnight extends Miniboss {
    constructor(level) {
        super("Dark Knight", level, 180, 17, 7);
    }
}

class Warlock extends Miniboss {
    constructor(level) {
        super("Warlock", level, 170, 16, 5);
    }
}

class GiantSpider extends Miniboss {
    constructor(level) {
        super("Giant Spider", level, 160, 14, 6);
    }
}

class BloodKnight extends Miniboss {
    constructor(level) {
        super("Blood Knight", level, 190, 16, 7);
    }
}

class Dragon extends Enemy {
    constructor(level) {
        super("Dragon", level, 280, 22, 12, 80, 160, 100, 200);
    }
}

const MAX_GROUP_SIZE = 4;

export function generateEnemyGroup(playerLevel, roomDifficulty, isFinalRoom = false, floorNum = 1) {
    const enemiesByDifficulty = {
        1: [Goblin, Skeleton],
        2: [Orc, Bandit],
        3: [Troll, Witch],
        4: [Demon, Slimes],
    };

    const minibosses = [Ogre, DarkKnight, Warlock, GiantSpider, BloodKnight];

    const group = [];

    const isFinalFloor = floorNum === 25;
    const isFloorEnd = isFinalRoom;

    let remainingDifficulty = isFinalRoom
        ? isFinalFloor
            ? 25
            : Math.min(25, roomDifficulty + 3)
        : roomDifficulty;

    if (isFinalFloor && isFloorEnd) {
        const boss = new Dragon(playerLevel + 2);
        group.push(boss);
        remainingDifficulty -= 6;
    }
    else if (isFloorEnd) {
        const MinibossClass = minibosses[Math.floor(Math.random() * minibosses.length)];
        const miniboss = new MinibossClass(playerLevel + 1 + Math.floor(floorNum / 5));
        group.push(miniboss);
        remainingDifficulty -= 4;
    }

    while (remainingDifficulty > 0 && group.length < MAX_GROUP_SIZE) {
        const possibleDifficulties = Object.keys(enemiesByDifficulty)
            .map(Number)
            .filter(d => d <= remainingDifficulty && (!isFinalRoom || d >= 2));

        if (possibleDifficulties.length === 0) break;

        const difficulty = possibleDifficulties[Math.floor(Math.random() * possibleDifficulties.length)];
        const enemyOptions = enemiesByDifficulty[difficulty];
        const EnemyClass = enemyOptions[Math.floor(Math.random() * enemyOptions.length)];

        const enemyLevel = isFinalRoom ? playerLevel + 1 : playerLevel;
        const enemy = new EnemyClass(enemyLevel);

        group.push(enemy);
        remainingDifficulty -= difficulty;
    }

    return group;
}