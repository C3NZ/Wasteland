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
        this.caravan = new Caravan(stats);
    }
}
