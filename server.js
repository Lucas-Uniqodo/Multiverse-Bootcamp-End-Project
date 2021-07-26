const express = require("express");
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const {
	allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const connection = require("./sequelize-connect");

const Items = require("./models/Item");
const Categories = require("./models/Category");

const app = express();
const port = 3000;

// setup our templating engine
const handlebars = expressHandlebars({
	handlebars: allowInsecurePrototypeAccess(Handlebars),
});

app.engine("handlebars", handlebars);
app.set("view engine", "handlebars");
app.use(express.json());

Categories.hasMany(Items);
Items.belongsTo(Categories);

connection
	.sync({
		//refreshs database every time server is rerun
		force: true,
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

app.get("/", async (request, response) => {
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

app.get("/items/:id", async (request, response) => {
	const item = await Menu.findByPk(request.params.id);
	if (!item) {
		return response.status(404).send("NOT FOUND");
	}

	response.render("item", { item });
});

//extension admin stuff
app.get("/adminform", async (request, response) => {
	response.render("adminform", { detailsValid });
});

app.get("/admin", async (request, response) => {
	const details = await Login.findOne({
		where: {
			username: request.body.username,
			password: request.body.password,
		},
	});
	const detailsValid = details ? true : false;

	response.redirect("/admin"); //might not work, haven't tested yet
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

	response.redirect("/items/" + item.id); //might not work, haven't tested yet
});

//edit Item
app.put("/item/:id", async (request, response) => {
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

	response.redirect("/items/" + item.id); //might not work, haven't tested yet
});

//delete item
app.delete("/item/:id", async (request, response) => {
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
