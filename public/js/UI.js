import { Config } from './Config.js';

export class UI {
    constructor(game) {
        this.game = game;
    }

    // Notify the user of an update
    notify(message, type) {
        const { caravan } = this.game;
        document.getElementById('updates-area').innerHTML = `
            <div class="update-${type}">Day ${Math.ceil(caravan.day)}: ${message}</div>
            ${document.getElementById('updates-area').innerHTML}
        `;
    }

    // Refresh the stats to be displayed on screen
    refreshStats() {
        const { caravan } = this.game;
        document.getElementById('stat-day').innerHTML = Math.ceil(caravan.day);
        document.getElementById('stat-distance').innerHTML = Math.floor(caravan.distance);
        document.getElementById('stat-crew').innerHTML = caravan.travelers;
        document.getElementById('stat-oxen').innerHTML = caravan.oxen;
        document.getElementById('stat-food').innerHTML = Math.ceil(caravan.food);
        document.getElementById('stat-money').innerHTML = caravan.money;
        document.getElementById('stat-firepower').innerHTML = caravan.firepower;
        document.getElementById('stat-weight').innerHTML = `${caravan.weight} / ${caravan.capacity}`;

        // Update the caravan positions
        document.getElementById('caravan').style.left = `${380 * caravan.distance / Config.FINAL_DISTANCE}px`;
    }
}

export default UI;
