import { Player } from '/Player';

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
                target: 'allEnemies',
                cooldown: 0,
                use: () => { }
            },
            {
                name: 'Shield Bash',
                type: 'attack',
                damage: 14,
                target: 'enemy',
                cooldown: 1,
                use: () => { }
            },
            {
                name: 'Bulwark',
                type: 'effect',
                target: 'self',
                cooldown: 0,
                use: () => { }
            }
        ];
    }
}


export class Healer extends Player {
    constructor(name = 'Healer') {
        super(name, 1, 90, 4, 3);
        this.skills = [
            {
                name: 'Group Heal',
                type: 'heal',
                healing: 15,
                target: 'allAllies',
                cooldown: 2,
                use: () => { }
            },
            {
                name: 'Single Heal',
                type: 'heal',
                healing: 25,
                target: 'ally',
                cooldown: 1,
                use: () => { }
            },
            {
                name: 'Purify',
                type: 'effect',
                target: 'ally',
                cooldown: 2,
                use: () => { }
            }
        ];
    }
}



export class Mage extends Player {
    constructor(name = 'Mage') {
        super(name, 1, 80, 10, 2);
        this.skills = [
            {
                name: 'Firestorm',
                type: 'attack',
                damage: 10,
                target: 'allEnemies',
                cooldown: 2,
                use: () => { }
            },
            {
                name: 'Stun Bolt',
                type: 'attack',
                damage: 8,
                chance: 80,
                target: 'enemy',
                cooldown: 1,
                use: () => { }
            },
            {
                name: 'Arcane Empowerment',
                type: 'effect',
                target: 'self',
                cooldown: 3,
                use: () => { }
            }
        ];
    }
}



export class Rogue extends Player {
    constructor(name = 'Rogue') {
        super(name, 1, 100, 7, 3);
        this.skills = [
            {
                name: 'Poison Dagger',
                type: 'attack',
                damage: 6,
                chance: 100,
                target: 'enemy',
                cooldown: 1,
                use: () => { }
            },
            {
                name: 'Backstab',
                type: 'attack',
                damage: 18,
                target: 'enemy',
                cooldown: 2,
                use: () => { }
            },
            {
                name: 'Expose Weakness',
                type: 'effect',
                target: 'enemy',
                cooldown: 2,
                use: () => { }
            }
        ];
    }
}


