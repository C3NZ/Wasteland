import {Config} from './Config.js';

class Caravan {
    constructor(stats) {
       init(stats);
    }

    init({day, distance, travelers, food, oxen, money, firepower}) {
        this.day = day;
        this.distance = distance;
        this.travelers = travelers;
        this.food = food;
        this.oxen = oxen;
        this.money = money;
        this.firepower = firepower;
    }

    //Update the weight and capacity
    updateWeight(){
        let droppedFood = 0;
        let droppedGuns = 0;

        //set the capacity and the current weight of the Caravan
        this.capacity = this.oxen * Config.WEIGHT_PER_OX + this.travelers * Config.WEIGHT_PER_PERSON;
        this.weight = this.food * Config.FOOD_WEIGHT + this.firepower * Config.FIREPOWER_WEIGHT;

        //While you're overencumbered, drop all your firepower first to hopefully stay within your capacity
        while(this.firepower && this.capacity <= this.weight) {
            this.firepower--;
            this.weight -= Config.FIREPOWER_WEIGHT;
            droppedGuns++;
        }

        //Notify the player of dropped items
        if(droppedGuns) {
            this.ui.notify('Left ' + droppedGuns + ' guns behind', 'negative')
        }

        //If you're still overencumbered, start dropping your food to stay within the weight capacity
        while(this.food && this.capacity <= this.weight) {
            this.food--;
            this.weight -= Config.FOOD_WEIGHT;
            droppedFood++;
        }

        if(droppedFood) {
            this.ui.notify('Left ' + droppedFood + ' pieces of food behind', 'negative');
        }
    }
    
    //Update the distance based on the speed the user is traveling
    updateDistance() {
        const diff = this.capacity - this.weight;
        const speed = (Config.SLOW_SPEED + diff) / (this.capacity * Config.FULL_SPEED);
        this.distance += speed;
    }
    
    //Consume food per person aboard the caravan
    consumeFood(){
        this.food -= this.crew * Config.FOOD_PER_PERSON; 
        
        if(this.food < 0) {
            this.food = 0;
        }
    }
}


