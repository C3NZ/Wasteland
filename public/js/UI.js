import { Config } from './Config.js';

export class UI {
    constructor(game) {
        this.game = game;
    }

    // Notify the user of an update
    notify(message, type) {
        const { mario } = this.game;
        document.getElementById('updates-area').innerHTML = `
            <div class="update-${type}">Day ${Math.ceil(mario.day)}: ${message}</div>
            ${document.getElementById('updates-area').innerHTML}
        `;
    }

    // Refresh the stats to be displayed on screen
    refreshStats() {
        const { mario } = this.game;
        document.getElementById('stat-day').innerHTML = Math.ceil(mario.day);
        document.getElementById('stat-distance').innerHTML = Math.floor(mario.distance);
        document.getElementById('stat-crew').innerHTML = mario.lives;
        document.getElementById('stat-oxen').innerHTML = mario.toads;
        document.getElementById('stat-food').innerHTML = Math.ceil(mario.food);
        document.getElementById('stat-money').innerHTML = mario.coins;
        document.getElementById('stat-firepower').innerHTML = mario.firepower;
        document.getElementById('stat-weight').innerHTML = `${mario.weight} / ${mario.capacity}`;

        // Update the caravan positions
        document.getElementById('caravan').style.left = `${380 * mario.distance / Config.FINAL_DISTANCE}px`;
    }

    // Show the player that they're being attacked by some savage bandits
    showAttack(firepower, coins) {
        const attackDiv = document.getElementById('attack');
        attackDiv.classList.remove('hidden');

        this.firepower = firepower;
        this.coins = coins;

        document.getElementById('attack-description').innerHTML = `firepower: ${firepower}`

        if (!this.attackInitiated) {
            document.getElementById('fight').addEventListener('click', this.fight.bind(this));

            document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

            this.attackInitiated = true
        }
    }

    fight() {
        const { firepower, coins } = this;

        const damage = Math.ceil(Math.max(0,
            firepower * 2 * Math.random() - this.game.mario.firepower));

        if (damage < this.game.mario.lives) {
            this.game.mario.lives -= damage;
            this.game.mario.coins += coins;
            this.notify(`${damage} people were killed fighting`, 'notify');
            this.notify(`Found $${coins}`, 'gold');
        } else {
            this.game.mario.lives = 0;
            this.notify('Everybody died in the fight', 'negative');
        }

        document.getElementById('attack').classList.add('hidden');
        this.game.resumeJourney();
    }

    runaway() {
        const { firepower } = this;

        const damage = Math.ceil(Math.max(0, firepower * Math.random() / 2));

        if (damage < this.game.mario.lives) {
            this.game.mario.crew -= damage;
            this.notify(`${damage} lives were lost fighting`, 'negative');
        } else {
            this.game.mario.lives = 0;
            this.notify('You died at the hands of fighting', 'negative');
            this.game.running = false;
        }

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
        if (product.price > this.game.mario.coins) {
            this.notify('Not enough money', 'negative');
            return false;
        }

        this.game.mario.coins -= product.price;
        this.game.mario[product.item] += +product.qty;
        this.notify(`Bought ${product.qty} x ${product.item}`, 'positive');

        this.game.mario.updateWeight();
        this.refreshStats();
        return true;
    }
}

export default UI;
