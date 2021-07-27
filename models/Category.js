const { sequelize, DataTypes, Model } = require("../sequelize");
const sequelizeConnect = require("../sequelize-connect");

/**
 * Represents a Category
 */

class Category extends Model {
	// add methods here
}
Category.init(
	{
		name: DataTypes.STRING,
		categoryImage: DataTypes.STRING,
	},
	{
		sequelize: sequelizeConnect,
		timestamps: false,
	}
);

module.exports = Category;
