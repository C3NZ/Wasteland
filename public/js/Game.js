import {Caravan} from './Caravan.js';
import {UI} from './UI.js';
import {Event} from './Event.js';
import {Config} from './Config.js';

function startGame(stats) {
    if(stats) {
        const game = new Game(stats);
    }else{
        const stats = {
            day: 0,
            distance: 0,
            travelers: 30,
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
        //this.world = new World() 
        this.init();
    }

    //start the journey
    init() {
        this.startJourney();
    }

    //Start the journey and entire game
    startJourney() {
        this.running = true;
        this.previousTime = false;
        this.ui.notify('The journey through the wasteland begins', 'positive');
        this.step();
    }
    
    //Game loop
    step(timestamp) {

        //first step, instantiate the previous time and call our update function
        if(!this.previousTime){
            this.previousTime = timestamp;
            this.update();
        }
        
        //Find the time elapsed
        const progress = timestamp - this.previousTime;
        
        //Make sure that the game isn't updating too fast 
        if(progress >= Config.GAME_SPEED) {
            this.previousTime = timestamp;
            this.update();
        }

        //Request another call as soon as the window allows us
        if (this.running) {
            window.requestAnimationFrame(this.step.bind(this))
        }
    }

    update() {
        //Update the day and consume food
        this.caravan.day += Config.DAY_PER_STEP;
        this.caravan.consumeFood();

        //End the game if there is no more food
        if (this.caravan.food === 0) {
            this.ui.notify('Your caravan has starved to death', 'negative');
            this.running = false;
            return;
        }

        //update weight, distance, and visual stats
        this.caravan.updateWeight();
        this.caravan.updateDistance();
        this.ui.refreshStats();

        //End game if there are no more travelers
        if (this.caravan.travelers <= 0) {
            this.caravan.travelers = 0;
            this.ui.notify('Everyone has died', 'negative');
            this.running === false;
            return;
        }

        //End game if there we have reached our end distance
        if (this.caravan.distance >= Config.FINAL_DISTANCE) {
            this.ui.notify('You have made it across the wasteland!', 'positive');
            this.running = false;
            return;
        }

        //Random event logic will go here
    }
    
    //Pause the journey
    pauseJourney() {
        this.running = false;
    }

    //Resume the journey
    resumeJourney() {
        this.running = true;
        this.step();
    }
}

startGame();
