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

connection
	.sync({
		//refreshs database every time server is rerun
		// force: true
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

app.get("/categories", async (request, response) => {
	const categories = await Category.findAll();
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

app.get("/admin", async (request, response) => {
	response.render("admin");
});

//create Item
app.post("/item", async (request, response) => {
	const item = await Item.create({
		title: request.body.title,
		image: request.body.image,
		price: request.body.price,
		categoryId: request.body.categoryId,
		description: request.body.description,
	});
	response.redirect("/home");
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

// When a browser makes a GET request to http://localhost:3000/restaurants this endpoint should respond with the full array of restaurant objects.

// Push your code to Github and share the link with your coach for review
