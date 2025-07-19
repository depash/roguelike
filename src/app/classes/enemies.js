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
        this.effects = new Map();
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
        let defence = this.baseDefense + (this.level - 1) * 1;

        if (this.hasEffect("defenseDebuff")) {
            defence = Math.floor(defence * 0.6);
        }

        return defence;
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
                const poisonDamage = Math.floor(clone.currentHealth * 0.1);
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

class Miniboss extends Enemy {
    constructor(name, level, baseHealth, baseAttack, baseDefense) {
        super(name, level, baseHealth, baseAttack, baseDefense, 50, 100, 50, 100);
    }
}

class Ogre extends Miniboss {
    constructor(level) {
        super("Ogre Brute", level, 200, 12, 8);
    }
}

class DarkKnight extends Miniboss {
    constructor(level) {
        super("Dark Knight", level, 180, 14, 7);
    }
}

class Warlock extends Miniboss {
    constructor(level) {
        super("Warlock", level, 180, 12, 4, 30, 55, 35, 65);
    }
}

class GiantSpider extends Miniboss {
    constructor(level) {
        super("Giant Spider", level, 160, 10, 6, 28, 52, 32, 60);
    }
}

class BloodKnight extends Miniboss {
    constructor(level) {
        super("Blood Knight", level, 190, 11, 5, 32, 60, 38, 68);
    }
}

class Dragon extends Enemy {
    constructor(level) {
        super("Dragon", level, 300, 20, 12, 100, 200, 150, 250);
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
        const miniboss = new MinibossClass(playerLevel + 1);
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