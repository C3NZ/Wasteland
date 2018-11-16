import {Caravan} from './Caravan.js';
import {UI} from './UI.js';
import {Event} from './Event.js';

function startGame(stats) {
    if(stats) {
        const game = new Game(stats);
    }else{
        const stats = {
            day: 0,
            distance: 0,
            crew: 30,
            food: 80,
            oxen: 2,
            money: 300,
            firepower: 2
        }
        const game = new Game(stats);
    }
}

class Game {
    constructor(stats){
        this.ui = new UI(this);
        this.eventManager = new Event(this)
        this.caravan = new Caravan(this, stats);
        this.world = new World() 
        this.init();
    }
    init() {
        this.startJourney();
    }

    startJourney() {
        this.running = true;
        this.previousTime = false;
        this.ui.notify('The journey through the wasteland begins', 'positive');
        this.step();
    }

    step(timestamp) {
        if(!this.previousTime){
            this.previousTime = timestamp;
            this.update();
        }

        const progress = timestamp - this.previousTime;

        if(progress >= Config.GAME_SPEED) {
            this.previousTime = timestamp;
            this.updateGame();
        }

        if (this.gameActive) {
            window.requestAnimationFrame(this.step.bind(this))
        }
    }

    updateGame() {
        this.caravan.day += Config.DAY_PER_STEP;

    }
}
