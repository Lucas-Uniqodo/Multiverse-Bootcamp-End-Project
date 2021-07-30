const { sequelize } = require("../sequelize");
const Category = require("../Models/Category");
const Item = require("../Models/Item");
const connection = require("../sequelize-connect");


/*Assumes no tables/data present and sets the relationships between the models primary/foreign keys. If not present, tests will fail with 'foreign key constarint'*/
Category.hasMany(Item, { as: "item", foreignKey: "CategoryId" });
Item.belongsTo(Category, { foreignKey: "CategoryId" });


/*Describes the test suite*/
describe("Omniverse e-commerce Tests", () => {
  /*Cleanses the db of existing tables/data before the test suite is run*/
  beforeAll(async () => {
    await connection
    .sync({
      //refreshs database every time server is rerun
      force: true,
    })
  })

    /********   Admin DB/Model TESTS *************/

    test("can create a new category", async () => {
      const category = await Category.create({
        name: "New category",
        categoryImage: "New image",
      });
      expect(category.id).toBe(1);
    });
  
    test("can create a new item", async () => {
      const item = await Item.create({
        title: "New item",
        image: "New image",
        price: 10.0,
        description: "Some description",
        CategoryId: 1,
      });
      expect(item.id).toBe(1);
    });
  
    test("can edit an existing item", async () => {
      const item = await Item.update(
        {
          description: "New description",
        },
        {
          where: { id: 1 },
        }
      );
    });
    /********   Customer (db) TESTS *************/

    test("can get all categories", async () => {
      const categories = await Category.findAll();
      console.log(categories.name);
      expect(categories.length).toBe(1)
    });
  
    test("can get one category", async () => {
      const categories = await Category.findOne({
        where: { id: 1 },
      });
      console.log(categories.name);
      expect(categories.id).toBe(1)
    });
  
    test("can get all items", async () => {
      const items = await Item.findAll();
      console.log(items.title);
      expect(items.length).toBe(1)
    });
    test("can get one item", async () => {
      const items = await Item.findOne({
        where: { id: 1 },
      });
      console.log(items.title);
      expect(items.id).toBe(1)
    });
        
    /********   Admin DB/Model TESTS *************/
    // test("can delete an existing category", async () => {
    //   const category = await Category.destroy(
    //       {
    //         where: { id: 1 },
    //       }
    //   )
    //   console.log("Category deleted")
    // })
  
    // test("can delete an existing item", async () => {
    //   const item = await Item.destroy(
    //       {
    //         where: { id: 1 },
    //       }
    //   )
    //   console.log("Item deleted")
    // })
  })