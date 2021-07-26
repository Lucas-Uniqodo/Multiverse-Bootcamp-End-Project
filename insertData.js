const sqlite3 = require('sqlite3').verbose();
const fsp = require('fs').promises; // Node.js file system module with promises
/**
This code illustrates how to load JSON data into an array.
*/
async function loadAndPrint() {
    const db = new sqlite3.Database('./omniverse.sqlite');
    // wait for the json file to be read
    try {
        const rawData = await fsp.readFile('./items.json');
        // convert the file data into JS objects (arrays)
        const categoriessArray = (JSON.parse(String(rawData)));


        db.serialize(function () {

            //this type of for loop allows for easy reference to both the index, and the element itself
            for (const [categoryIndex, category] of categoriessArray.entries()) {
                let stmt
                
                try {
                    stmt = db.prepare('INSERT INTO Categories (name, categoryImage) VALUES (?, ?)')
                    stmt.run(category.name, category.categoryImage)
                    
                } finally {
                    stmt.finalize();
                }

                category.items.forEach(item => {

                    try {
                        stmt = db.prepare('INSERT INTO Items (title, price, description, image, categoryId) VALUES (?, ?, ?, ?, ?)')
                        stmt.run(item.title, item.price, item.description, item.image, categoryIndex+1)
                        
                    } finally {
                        stmt.finalize();
                    }
                });
            };

        });
    } catch (error) {
        // if we get here, our file read has failed
        console.error('problem reading the file'+ error);
    }
}
// main flow

module.exports = loadAndPrint()
