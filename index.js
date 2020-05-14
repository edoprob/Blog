const express = require('express');
const app = express();
const session = require("express-session");
const bodyParser = require('body-parser');
const connection = require('./database/database');

const categoriesController = require('./categories/CategoriesController');
const articleController = require('./articles/ArticlesController');
const UserController = require("./user/UserController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

connection.authenticate().then(function(){
	console.log("conexão ao DB com sucesso");
}).catch(function(erro){
	console.log("erro no DB: "+erro);
});

// view engine
app.set('view engine', 'ejs');
app.use(session({
	secret: "qwehkjhasdbjwqlkeoia", 
	cookie: {
		maxAge: 3000000
	}
}));
app.use(express.static('public'));

// body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// configurador de rotas nos Controllers
app.use("/", categoriesController);
app.use("/", articleController);
app.use("/", UserController);


// Rota Index
app.get("/", function(req, res){
	Article.findAll({
		order: [
			["id", "DESC"]
		],
		limit: 4
	}).then(function(temp_articles){
		Category.findAll().then(function(temp_categories){
			res.render("index", {articles: temp_articles, categories: temp_categories});
		});
		
	});
});

app.get("/:slug", function(req, res){
	var slug = req.params.slug;
	Article.findOne({
		where: {
			slug: slug
		}
	}).then(function(temp_article){
		if (temp_article != undefined) {
			Category.findAll().then(function(temp_categories){
				res.render("article", {article: temp_article, categories: temp_categories});
			});
					
		} else {res.redirect("/");}
	}).catch(function(){
		res.redirect("/");
	})
});

app.get("/category/:slug", function(req, res){
	var slug = req.params.slug;
	Category.findOne({
		where: {
			slug: slug
		},
		include: [{model: Article}]
	}).then(function(temp_category){
		if (temp_category != undefined) {
			Category.findAll().then(function(temp_categories){
				res.render("category", {categories: temp_categories, articles: temp_category.articles, category: temp_category})
			})
		} else {
			res.redirect("/");
		}
	}).catch(function(erro){console.log(erro)});
});

// Ligando servidor
app.listen(8081, function(){
	console.log("app rodando!");
});