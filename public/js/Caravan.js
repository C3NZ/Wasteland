import { Config } from './Config.js';

export class Mario {
    constructor(game, stats) {
        this.game = game;
        this.init(stats);
    }

    // Init function for starting our game
    // eslint-disable-next-line
    init({ day, distance, lives, food, toads, coins, firepower }) {
        this.day = day;
        this.distance = distance;
        this.lives = lives;
        this.food = food;
        this.toads = toads;
        this.coins = coins;
        this.firepower = firepower;
    }

    // Update the weight and capacity
    updateWeight() {
        let droppedFood = 0;
        let droppedGuns = 0;

        // set the capacity and the current weight of the Caravan
        this.capacity = this.toads * Config.WEIGHT_PER_OX
                        + this.lives * Config.WEIGHT_PER_PERSON;

        this.weight = this.food * Config.FOOD_WEIGHT + this.firepower * Config.FIREPOWER_WEIGHT;

        // While you're overencumbered, drop all your firepower first
        // to hopefully stay within your capacity
        while (this.firepower && this.capacity <= this.weight) {
            this.firepower -= 1;
            this.weight -= Config.FIREPOWER_WEIGHT;
            droppedGuns += 1;
        }

        // Notify the player of dropped items
        if (droppedGuns) {
            this.game.ui.notify(`Left ${droppedGuns} guns behind`, 'negative');
        }

        // If you're still overencumbered, start dropping
        // your food to stay within the weight capacity
        while (this.food && this.capacity <= this.weight) {
            this.food -= 1;
            this.weight -= Config.FOOD_WEIGHT;
            droppedFood += 1;
        }

        if (droppedFood) {
            this.game.ui.notify(`Left ${droppedFood} pieces of food behind`, 'negative');
        }
    }

    // Update the distance based on the speed the user is traveling
    updateDistance() {
        const diff = this.capacity - this.weight;
        const adjustedSpeed = Config.FINAL_DISTANCE + Config.SLOW_SPEED + diff;
        const speed = adjustedSpeed / (this.capacity * Config.FULL_SPEED);
        this.distance += speed;
    }

    // Consume food per person aboard the caravan
    consumeFood() {
        this.food -= this.lives * Config.FOOD_PER_PERSON;

        if (this.food < 0) {
            this.food = 0;
        }
    }
}

export default Mario;
