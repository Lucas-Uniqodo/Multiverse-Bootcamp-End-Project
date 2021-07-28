const express = require("express");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const {
	allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const connection = require("./sequelize-connect");

const Item = require("./models/Item");
const Category = require("./models/Category");

const app = express();
const port = 3000;

var hbs = expressHandlebars.create({
	helpers: {
		json: function (value, options) {
			return JSON.stringify(value);
		},
	},
	handlebars: allowInsecurePrototypeAccess(Handlebars),
});

// setup our templating engine
// const handlebars = expressHandlebars({
// 	handlebars: allowInsecurePrototypeAccess(Handlebars),
// });

app.engine("handlebars", hbs.engine);

app.set("view engine", "handlebars");
app.use(express.json());
app.use(express.static("views/images"));

Category.hasMany(Item);
Item.belongsTo(Category);

connection
	.sync({
		//refreshs database every time server is rerun
		// force: true,
	})
	.then(() => {
		console.log("Connected to DB");
	})
	.catch((err) => {
		console.error("Unable to connect:", err);
	});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//fairly self explanatory, displays the handlebars pages
app.get("/home", async (request, response) => {
	response.render("home");
});

app.get("/addForm", async (request, response) => {
	response.render("addForm");
});

// sends items values to the handlebar file, so the form can be filled in with it's existing values
app.get("/updateForm/:id", async (request, response) => {
	const item = await Item.findByPk(request.params.id);
	response.render("updateForm", { item });
});

app.get("/cart", async (request, response) => {
	response.render("cart");
});

app.get("/", async (request, response) => {
	response.redirect("/home");
});

// gets all categories from the database and sends them to the handlebars file to be displayed
app.get("/categories", async (request, response) => {
	const categories = await Category.findAll();
	console.log(categories[0].categoryImage);
	response.render("categories", { categories });
});

// gets all items from the database from a single category and sends them to the handlebars file to be displayed
app.get("/categories/:id", async (request, response) => {
	const category = await Category.findOne({
		where: { id: request.params.id },
		include: [Item],
	});
	response.render("items", { category });
});

//extension admin stuff
//creates a new Item
app.post("/items", async (request, response) => {
	const item = await Item.create({
		title: request.body.title,
		image: request.body.image,
		price: request.body.price,
		CategoryId: request.body.categoryId,
		description: request.body.description,
	});

	response.redirect("/categories/" + item.CategoryId); //redirects user to the corressponding category page
});

//edits an existing Item
app.post("/item/:id/put", async (request, response) => {
	let item = await Item.findByPk(request.params.id);
	if (!item) {
		return response.status(404).send("NOT FOUND");
	}

	console.log(request.body);
	await Item.update(
		{
			title: request.body.title,
			image: request.body.image,
			price: request.body.price,
			CategoryId: request.body.categoryId,
			description: request.body.description,
		},
		{
			where: { id: request.params.id },
		}
	);

	item = await Item.findByPk(request.params.id);

	console.log("update complete");
	response.redirect("/categories/" + item.CategoryId); //redirects user to the corressponding category page
});

//deletes an Item
app.get("/item/:id/delete", async (request, response) => {
	const item = await Item.findByPk(request.params.id);
	if (!item) {
		return response.status(404).send("NOT FOUND");
	}
	await Item.destroy({
		where: { id: request.params.id },
	});

	response.redirect("/categories/" + item.CategoryId); //redirects user to the corressponding category page
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
