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

    // Show the player that they're being attacked by some savage bandits
    showAttack(firepower, gold) {
        const attackDiv = document.getElementById('attack');
        attackDiv.classList.remove('hidden');

        this.firepower = firepower;
        this.gold = gold;

        document.getElementById('attack-description').innerHTML = `firepower: ${firepower}`

        if (!this.attackInitiated) {
            document.getElementById('fight').addEventListener('click', this.fight.bind(this));

            document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

            this.attackInitiated = true
        }
    }

    fight() {
        const { firepower, gold } = this;

        const damage = Math.ceil(Math.max(0,
            firepower * 2 * Math.random() - this.game.caravan.firepower));

        if (damage < this.game.caravan.crew) {
            this.game.caravan.crew -= damage;
            this.game.caravan.money += gold;
            this.notify(`${damage} people were killed fighting`, 'notify');
            this.notify(`Found $${gold}`, 'gold');
        } else {
            this.game.caravan.crew = 0;
            this.notify('Everybody died in the fight', 'negative');
        }

        document.getElementById('attack').classList.add('hidden');
        this.game.resumeJourney();
    }

    runaway() {
        const { firepower } = this;

        const damage = Math.ceil(Math.max(0, firepower * Math.random() / 2));

        if (damage < this.game.caravan.crew) {
            this.game.caravan.crew -= damage;
            this.notify(`${damage} people were killed fighting`, 'negative');
        } else {
            this.game.caravan.crew = 0;
            this.notify('Everybody died running away', 'negative');
        }

        document.getElementById('runaway').removeEventListener('click');
        document.getElementById('attack').classList.add('hidden');

        this.game.resumeJourney();
    }

    // Show the shop and all the possible items randomly selected from the shop owners inventory
    showShop(products) {
        const shopDiv = document.getElementById('shop');
        shopDiv.classList.remove('hidden');

        if (!this.shopInitiated) {
            shopDiv.addEventListener('click', function(e) {
                const target = e.target || e.src;

                // Exit button
                if (target.tagName === 'BUTTON') {
                    shopDiv.classList.add('hidden');
                    this.game.resumeJourney();
                // Allow the user to buy the product
                } else if (target.tagName === 'DIV' && target.className.match(/product/)) {
                    this.buyProduct({
                        item: target.getAttribute('data-item'),
                        qty: target.getAttribute('data-qty'),
                        price: target.getAttribute('data-price'),
                    });
                }
            }.bind(this));
            this.shopInitiated = true;
        }

        const prodsDiv = document.getElementById('prods');
        prodsDiv.innerHTML = '';

        let product;
        for (let i = 0; i < products.length; i += 1) {
            product = products[i];
            prodsDiv.innerHTML += `<div class="product" data-qty="${product.qty}" data-item="${product.item}" data-price="${product.price}"> ${product.qty} ${product.item} - $ ${product.price}</div>`;
        }
    }

    // buy product from the shop if the user has enough money
    buyProduct(product) {
        if (product.price > this.game.caravan.money) {
            this.notify('Not enough money', 'negative');
            return false;
        }

        this.game.caravan.money -= product.price;
        this.game.caravan[product.item] += +product.qty;
        this.notify(`Bought ${product.qty} x ${product.item}`, 'positive');

        this.game.caravan.updateWeight();
        this.refreshStats();
        return true;
    }
}

export default UI;
