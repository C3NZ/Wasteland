const eventTypes = [

]

class Event {
    constructor(game) {
        this.game = game;
        this.caravan = game.caravan;
        this.ui = game.ui;
    }
}

export default { Event };
