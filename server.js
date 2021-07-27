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

// setup our templating engine
const handlebars = expressHandlebars({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("handlebars", handlebars);

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

app.get("/home", async (request, response) => {
	response.render("home");
});

app.get("/addForm", async (request, response) => {
	response.render("addForm");
});

app.get("/", async (request, response) => {
	response.render("home");
});

app.get("/categories", async (request, response) => {
	const categories = await Category.findAll();
	console.log(categories[0].categoryImage);
	response.render("categories", { categories });
});

app.get("/cart", async (request, response) => {
	response.render("cart");
});

app.get("/categories/:id", async (request, response) => {
	const category = await Category.findOne({
		where: { id: request.params.id },
		include: [Item],
	});
	response.render("items", { category });
});

//extension admin stuff
//create Item
app.post("/items", async (request, response) => {
	const item = await Item.create({
		title: request.body.title,
		image: request.body.image,
		price: request.body.price,
		CategoryId: request.body.categoryId,
		description: request.body.description,
	});

	response.redirect("/categories/" + item.CategoryId); //might not work, haven't tested yet
});

//edit Item
app.get("/updateForm/:id", async (request, response) => {
	id = request.params.id;
	response.render("updateForm", { id });
});

app.get("/item/:id/put", async (request, response) => {
	const item = await Item.findByPk(request.params.id);
	if (!item) {
		return response.status(404).send("NOT FOUND");
	}

	await Item.update(
		{
			title: request.body.title,
			image: request.body.image,
			price: request.body.price,
			categoryId: request.body.categoryId,
			description: request.body.description,
		},
		{
			where: { id: request.params.id },
		}
	);

	response.redirect("/categories/" + item.CategoryId); //might not work, haven't tested yet
});

//delete item
app.get("/item/:id/delete", async (request, response) => {
	const item = await Item.findByPk(request.params.id);
	if (!item) {
		return response.status(404).send("NOT FOUND");
	}
	await Item.destroy({
		where: { id: request.params.id },
	});

	response.redirect("/home");
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
