import { Config } from './Config.js';

const eventTypes = [
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'lives',
        value: -3,
        text: 'You got stomped by a Goomba. Lives lost: ',
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'lives',
        value: -4,
        text: 'You got hit by a sheel. Lives lost: ',
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'food',
        value: -3,
        text: 'Baby bowser stole some of your food while you were sleeping. Food lost: ',
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'coins',
        value: -50,
        text: 'Koopa kid jumped on your head! coins lost: ',
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'toads',
        value: -1,
        text: 'You had to use a toad to jump over a barracade. toads lost:  ',
    },
    {
        type: 'STAT-CHANGE',
        notification: 'positive',
        stat: 'food',
        value: 20,
        text: 'You found a block with some food in it! Food gained: ',
    },
    {
        type: 'STAT-CHANGE',
        notification: 'positive',
        stat: 'toads',
        value: 1,
        text: 'You found a tied up toad along the way! Mushrooms gained: ',
    },
    {
        type: 'ATTACK',
        notification: 'negative',
        text: 'The Goombas are launching an assault!',
    },
    {
        type: 'ATTACK',
        notification: 'negative',
        text: 'The goombas are launching an assault!',
    },
    {
        type: 'ATTACK',
        notification: 'negative',
        text: 'The goombas are launching an assault!',
    },
    {
        type: 'SHOP',
        notification: 'neutral',
        text: 'You have found Luigi looking to trade!',
        products: [
            { item: 'food', qty: 20, price: 50 },
            { item: 'toads', qty: 1, price: 200 },
            { item: 'firepower', qty: 2, price: 50 },
            { item: 'lives', qty: 10, price: 80 },
        ],
    },
    {
        type: 'SHOP',
        notification: 'neutral',
        text: 'You have found a friendly toad shop!',
        products: [
            { item: 'food', qty: 30, price: 50 },
            { item: 'toads', qty: 1, price: 200 },
            { item: 'firepower', qty: 2, price: 20 },
            { item: 'lives', qty: 10, price: 60 },
        ],
    },
    {
        type: 'SHOP',
        notification: 'neutral',
        text: 'Some rogue goombas are looking to trade!',
        products: [
            { item: 'food', qty: 20, price: 60 },
            { item: 'toads', qty: 1, price: 300 },
            { item: 'firepower', qty: 2, price: 80 },
            { item: 'lives', qty: 5, price: 60 },
        ],
    },
];

export class Event {
    constructor(game) {
        this.game = game;
        this.ui = game.ui;
    }

    generateEvent() {
        const eventIndex = Math.floor(Math.random() * eventTypes.length);
        const eventData = eventTypes[eventIndex];

        if (eventData.type === 'STAT-CHANGE') {
            this.stateChangeEvent(eventData);
        } else if (eventData.type === 'ATTACK') {
            this.game.pauseJourney();
            this.ui.notify(eventData.text, eventData.notification);
            this.attackEvent();
        } else if (eventData.type === 'SHOP') {
            this.game.pauseJourney();
            this.ui.notify(eventData.text, eventData.notifcation);
            this.shopEvent(eventData);
        }
    }

    // Handle a state change that occurs on a caravan
    stateChangeEvent(eventData) {
        if (eventData.value + this.game.mario[eventData.stat] >= 0) {
            this.game.mario[eventData.stat] += eventData.value;
            this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
        }
    }

    // Handle a attack event occurring to the caravan
    attackEvent() {
        const firepower = Math.round((0.7 + 0.6 * Math.random()) * Config.ENEMY_FIREPOWER_AVG);
        const coins = Math.round((0.7 + 0.6 * Math.random()) * Config.ENEMY_GOLD_AVG);

        this.ui.showAttack(firepower, coins);
    }

    // Handle a shop event occurring
    shopEvent(eventData) {
        const numProds = Math.ceil(Math.random() * 4);

        const products = [];
        let j;
        let priceFactor;

        for (let i = 0; i < numProds; i += 1) {
            j = Math.floor(Math.random() * eventData.products.length);

            priceFactor = 0.7 + 0.6 * Math.random();

            products.push({
                item: eventData.products[j].item,
                qty: eventData.products[j].qty,
                price: Math.round(eventData.products[j].price * priceFactor),
            });
        }
        this.ui.showShop(products);
    }
}

export default { Event };
