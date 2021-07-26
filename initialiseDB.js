const sqlite3 = require('sqlite3').verbose();
/**
 * This code creates the tables for the e-commerce assignment
 */
function initialise() {
    // connect to a database named omniverse.sqlite
    const db = new sqlite3.Database('./omniverse.sqlite');
    freezeTableName: true;
    try {
        db.serialize(function () { // serialize means execute one statement at a time
            console.log('starting table creation');
            // delete tables if they already exist
            db.run("DROP TABLE IF EXISTS Category");
            db.run("DROP TABLE IF EXISTS Item");
            // create new, empty tables with specific columns and column types
            db.run("CREATE TABLE Category (id INTEGER PRIMARY KEY AUTOINCREMENT, name STRING)");
            db.run("CREATE TABLE Item(id Integer Primary Key Autoincrement, title STRING, price FLOAT, image STRING,FOREIGN KEY (CategoryId) REFERENCES Category(id))");
        });
    } finally {
        // very important to always close database connections
        // else could lead to memory leaks
        db.close();
        console.log('table creation complete - connection closed');
    }
}
module.exports = initialise;
// local testing (comment out if running tests from jest)
initialise();