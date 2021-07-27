const { sequelize, DataTypes, Model } = require("../sequelize");
const sequelizeConnect = require("../sequelize-connect");

/**
 * Represents items within categories
 */

class Item extends Model {}
Item.init(
	{
		title: DataTypes.STRING,
		price: DataTypes.FLOAT,
		description: DataTypes.STRING,
		image: DataTypes.STRING,
	},
	{
		sequelize: sequelizeConnect,
		timestamps: false,
	}
);

module.exports = Item;
