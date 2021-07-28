const { sequelize } = require("../sequelize");
const Category = require("../Models/Category");
const Item = require("../Models/Item");
// const app = require("express");
// const request = require("express");
// const response = require("express");
// const fetch = require("node-fetch");

/*Assumes no tables/data present and sets the relationships between the models primary/foreign keys. If not present, tests will fail with 'foreign key constarint'*/
Category.hasMany(Item, { as: "item", foreignKey: "CategoryId" });
Item.belongsTo(Category, { foreignKey: "CategoryId" });

/*Describes the test suite*/
describe("Omniverse e-commerce Tests", () => {
  /*Cleanses the db of existing tables/data before the test suite is run*/
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  /********   DB/Model TESTS *************/

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
        where: { id: 2 },
      }
    );
  });
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

  /********   Customer (db) TESTS *************/

  test("can get all categories", async () => {
    const categories = await Category.findAll();
    console.log(categories.name);
    //expect(categories.id).toBe(1)
  });

  test("can get one category", async () => {
    const categories = await Category.findOne({
      where: { id: 1 },
    });
    console.log(categories.name);
    //expect(categories.id).toBe(1)
  });

  test("can get all items", async () => {
    const items = await Item.findAll();
    console.log(items.title);
    //expect(items.id).toBe(1)
  });
  test("can get one item", async () => {
    const items = await Item.findOne({
      where: { id: 1 },
    });
    console.log(items.title);
    //expect(items.id).toBe(1)
  });

  /********   Customer (server) TESTS *************/
  // test("can get homepage", async () => {
  //    try{const online = await fetch("http://localhost:3000/home")
  //    if (!response == 'undefined') {
  //     throw new Error(response.error);}
  //     return response;
  // })
  //   .catch(fetch.FetchError);
  // test("can add item to cart",  async() => {})
  // test("can delete item from cart", async() => {})
});
