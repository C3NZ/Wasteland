class UI {
    constructor(game) {
        this.game = game;
    }

    notify(message, type) {
        console.log(`${message} - ${type}`)
    }

    refreshStats() {
        console.log(this.game.caravan)
    }
}

export default UI;
