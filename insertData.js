const sqlite3 = require('sqlite3').verbose();
const fsp = require('fs').promises; // Node.js file system module with promises

async function load() { // returns a promise of an array
    const rawData = await fsp.readFile('./items.json');
    const restaurantsArray = (JSON.parse(String(rawData)));
    return restaurantsArray;
}
function insert(restaurantsArray) {
    const db = new sqlite3.Database('./omniverse.sqlite');

    try {
        db.serialize(function () {

            let menuCounter = 1;

            for (let i = 0; i < restaurantsArray.length; i++) {

                const currentRestaurant = restaurantsArray[i];

                let stmt;

                try {
                    stmt = db.prepare(`INSERT INTO Category (name) VALUES (?)`);
                    stmt.run(currentRestaurant.name);
                } finally {
                    stmt.finalize();
                }

                for (j = 0; j < currentRestaurant.item.length; j++) {
                    const currentMenu = currentRestaurant.item[j];
                    try {
                        stmt = db.prepare(`INSERT INTO Item (title, price, image) VALUES (?, ?, ?)`);
                        stmt.run(currentMenu.title, i + 1);
                    } finally {
                        stmt.finalize();
                    }

                    menuCounter++;
                }
            }
        });
    } finally {
        db.close();
        console.log('database closed');
    }
}
module.exports = { load, insert }

// local testing (comment out if running tests from jest)
console.log('starting populate');
load()
    .then(restaurantsArray => {
        console.log("data loaded");
        insert(restaurantsArray);
        console.log("inserts complete");
    })
    .catch(err => {
        console.error("data could not be loaded"+err);
    })
