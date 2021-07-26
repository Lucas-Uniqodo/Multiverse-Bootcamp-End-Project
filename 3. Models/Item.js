const {sequelize, DataTypes, Model} = require('../sequelize');
const {Category} = require('./Category')

/**
 * Represents items within categories
 */

class Item extends Model {

}
Item.init({
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
}, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
});
Category.hasMany(Item, {as: 'item', foreignKey: 'CategoryId'})
Item.belongsTo(Category, {foreignKey: 'CategoryId'})

module.exports = { Item, Category }