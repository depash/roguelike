export class Player {
    constructor(name) {
        this.name = name;
        this.level = 1;
        this.health = 100;
        this.maxHealth = 100;
        this.attack = 5;
        this.defense = 2;
        this.gold = 0;
        this.exp = 0;
    }

    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            console.log(`${this.name} has died. Game over.`);
        }
    }

    levelUp() {
        this.exp = 0;
        this.level++;
        this.maxHealth += 20;
        this.health = this.maxHealth;
        this.attack += 2;
        this.defense += 1;
    }
}
