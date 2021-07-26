const {sequelize, DataTypes, Model} = require('../sequelize');
const {Item} = require('./Item')
/**
 * Represents a Category
 */

class Category extends Model {
    // add methods here
}
Category.init({
    id: DataTypes.INTEGER,
    name: DataTypes.STRING,
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
});

Category.hasMany(Item, {as: 'item', foreignKey: 'CategoryId'})
Item.belongsTo(Category, {foreignKey: 'CategoryId'})

module.exports = { Category, Item }