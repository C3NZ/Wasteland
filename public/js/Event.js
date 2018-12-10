import { Config } from './Config.js';

const eventTypes = [
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'travelers',
        value: -3,
        text: 'Irradiated food. Casualties: ',
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'travelers',
        value: -4,
        text: 'Rad-x withdrawal, Casualties: ',
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'food',
        value: -3,
        text: 'Rad Roach infestation, Casualties',
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'money',
        value: -50,
        text: 'Bandits rob the Caravan, they stole $',
    },
    {
        type: 'STAT-CHANGE',
        notification: 'negative',
        stat: 'oxen',
        value: -1,
        text: 'Your oxen drank irradiated water. Casualties: ',
    },
    {
        type: 'STAT-CHANGE',
        notification: 'positive',
        stat: 'food',
        value: 20,
        text: 'Came across an abandonded gas station with food in it. Food added: ',
    },
    {
        type: 'STAT-CHANGE',
        notification: 'positive',
        stat: 'oxen',
        value: 1,
        text: 'Came across tame wild oxen. New oxen: ',
    },
    {
        type: 'ATTACK',
        notification: 'negative',
        text: 'Bandits are attacking!',
    },
    {
        type: 'ATTACK',
        notification: 'negative',
        text: 'Bandits are attacking!',
    },
    {
        type: 'ATTACK',
        notification: 'negative',
        text: 'Bandits are attacking!',
    },
    {
        type: 'SHOP',
        notification: 'neutral',
        text: 'You have found another caravan!',
        products: [
            { item: 'food', qty: 20, price: 50 },
            { item: 'oxen', qty: 1, price: 200 },
            { item: 'firepower', qty: 2, price: 50 },
            { item: 'crew', qty: 10, price: 80 },
        ],
    },
    {
        type: 'SHOP',
        notification: 'neutral',
        text: 'You have found another caravan!',
        products: [
            { item: 'food', qty: 30, price: 50 },
            { item: 'oxen', qty: 1, price: 200 },
            { item: 'firepower', qty: 2, price: 20 },
            { item: 'crew', qty: 10, price: 60 },
        ],
    },
    {
        type: 'SHOP',
        notification: 'neutral',
        text: 'You have come across !',
        products: [
            { item: 'food', qty: 20, price: 60 },
            { item: 'oxen', qty: 1, price: 300 },
            { item: 'firepower', qty: 2, price: 80 },
            { item: 'crew', qty: 5, price: 60 },
        ],
    },
];

export class Event {
    constructor(game) {
        this.game = game;
        this.caravan = game.caravan;
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
            this.attackEvent(eventData);
        } else if (eventData.type === 'SHOP') {
            this.game.pauseJourney();
            this.ui.notify(eventData.text, eventData.notifcation);
            this.shopEvent(eventData);
        }
    }

    // Handle a state change that occurs on a caravan
    stateChangeEvent(eventData) {
        if (eventData.value + this.game.caravan[eventData.stat] >= 0) {
            this.game.caravan[eventData.stat] += eventData.value;
            this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
        }
    }

    // Handle a attack event occurring to the caravan
    attackEvent(eventData) {
        const firepower = Math.round((0.7 + 0.6 * Math.random()) * Config.ENEMY_FIREPOWER_AVG);
        const gold = Math.round((0.7 + 0.6 * Math.random()) * Config.ENEMY_GOLD_AVG);

        this.ui.showAttack(firepower, gold);
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
