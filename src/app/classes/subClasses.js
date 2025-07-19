import { Player } from './player.js';

// make inherated from player class
// warrior: taunt, single target attack, self buff for attack and defense
// Healer: Group healing, single target healing, curing status effects
// mage: aoe attack, stun(RNG 80% reduce by 15% per stun restarts after new room), buff increace damage of attacks
// rouge: single targer poison, single target high attack, enemy defence defuff
// satus effects: mabey poison, stun, burn, freeze, bleed

// {
//   name: string,
//   type: 'attack' | 'heal' | 'effect', 
//   damage?: number,
//   healing?: number
//   target: 'self' | 'ally' | 'enemy' | 'allAllies' | 'allEnemies',
//   cooldown: number,
//   currentCooldown?: number,
//   chance?: number,         // % chance for effects like stun/poison
//   use?: (context) => void
// }

export class Warrior extends Player {
    constructor(name = 'Warrior') {
        super(name, 1, 120, 8, 5);
        this.skills = [
            {
                name: 'Taunt',
                type: 'effect',
                aoe: true,
                cooldown: 3,
                turns: 2,
            },
            {
                name: 'Shield Bash',
                type: 'attack',
                damage: Math.ceil(10 + this.level * 2),
                aoe: false,
                cooldown: 3,
            },
            {
                name: 'Bulwark',
                type: 'buff',
                defensePercent: 0.4,
                turns: 3,
                cooldown: 5,
            }
        ];
    }

    healthPerLevel() { return 35; }
    attackPerLevel() { return 2; }
    defensePerLevel() { return 2; }
}

export class Healer extends Player {
    constructor(name = 'Healer') {
        super(name, 1, 90, 4, 3);
        this.skills = [
            {
                name: 'Group Heal',
                type: 'heal',
                healing: Math.ceil(15 + this.level * 1.5),
                aoe: true,
                cooldown: 5,
            },
            {
                name: 'Single Heal',
                type: 'heal',
                healing: Math.ceil(25 + this.level * 1.5),
                aoe: false,
                cooldown: 3,
            },
            {
                name: 'resurrect',
                type: 'heal',
                target: 'ally',
                cooldown: 8,
            }
        ];
    }

    healthPerLevel() { return 15; }
    attackPerLevel() { return 1; }
    defensePerLevel() { return 1.5; }
}

export class Mage extends Player {
    constructor(name = 'Mage') {
        super(name, 1, 80, 10, 2);
        this.skills = [
            {
                name: 'Firestorm',
                type: 'attack',
                damage: Math.ceil(10 + this.level * 2.5),
                aoe: true,
                cooldown: 4,
            },
            {
                name: 'Stun Bolt',
                effectType: 'stun',
                type: 'effect',
                damage: Math.ceil(6 + this.level * 1.5),
                aoe: false,
                cooldown: 7,
                turns: 2,
            },
            {
                name: 'Arcane Empowerment',
                type: 'buff',
                attackPercent: 0.2,
                cooldown: 5,
                turns: 3,
            }
        ];
    }

    healthPerLevel() { return 10; }
    attackPerLevel() { return 3; }
    defensePerLevel() { return 0.5; }
}

export class Rogue extends Player {
    constructor(name = 'Rogue') {
        super(name, 1, 100, 7, 3);
        this.skills = [
            {
                name: 'Poison Dagger',
                type: 'effect',
                damage: Math.ceil(6 + this.level * 1.5),
                effectType: 'poison',
                aoe: false,
                cooldown: 5,
                turns: 4,
            },
            {
                name: 'Backstab',
                type: 'attack',
                damage: Math.ceil(18 + this.level * 1.5),
                aoe: false,
                cooldown: 4,
                ignoresDefense: true,
            },
            {
                name: 'Expose Weakness',
                type: 'effect',
                effectType: 'defenseDebuff',
                target: 'enemy',
                cooldown: 5,
                turns: 3,
            }
        ];
    }

    healthPerLevel() { return 20; }
    attackPerLevel() { return 2.5; }
    defensePerLevel() { return 1; }
}