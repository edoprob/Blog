const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth , function(req, res){
		Article.findAll({
			include: [{model: Category}]
		}).then(function(temp){
			if (temp != undefined) {
				res.render("admin/articles/index", {articles: temp});
			} else {
				res.redirect("/");
			}
		})
});

router.get("/admin/articles/new", adminAuth , function(req, res){
	Category.findAll().then(function(temp){
		res.render("admin/articles/new", {categories: temp});
	})
});

router.post("/articles/save", function(req, res){
	var temp_title = req.body.title;
	var temp_body = req.body.body;
	var temp_category = req.body.category;

	Article.create({
		title: temp_title,
		slug: slugify(temp_title),
		body: temp_body,
		categoryId: temp_category
	}).then(function(){
		res.redirect("/admin/articles");
	});
});

router.post("/articles/delete", function(req, res){
	var temp = req.body.id;
	if (temp != undefined) {
		if (!isNaN(temp)) {
			Article.destroy({
				where: {
					id: temp
				}
			});
			res.redirect("/admin/articles")
		} else { // NaN
			res.redirect("/admin/articles")
		}
	} else {// null
		res.redirect("/admin/articles")
	}
});

router.get("/admin/articles/edit/:id", adminAuth , function(req, res){
	var temp_id = req.params.id;
	Article.findOne({
		where: {
			id: temp_id
		},
		include: [{model: Category}]
	}).then(function(temp_article){

		if (temp_article != undefined) {
			Category.findAll().then(function(temp_categories){
				res.render("admin/articles/edit", {article: temp_article, categories: temp_categories});
			});

		} else {
			res.redirect("/admin/articles");
		}
	});
});

router.post("/articles/update", function(req, res){
	var temp_title = req.body.title;
	var temp_body = req.body.body;
	var temp_categoryId = req.body.category;
	var temp_id = req.body.id;

	Article.update({
		title: temp_title,
		slug: slugify(temp_title),
		body: temp_body,
		categoryId: temp_categoryId
	},{
		where: {
			id: temp_id
		}
	}).then(function(){
		res.redirect("/admin/articles");
	}).catch(function(erro){
		console.log("ERRO AQUIIIII: "+erro)
	})
});

router.get("/articles/page/:num", function(req, res){
	var page = req.params.num;
	var offset;

	if (isNaN(page) || page == 1) {
		offset = 0
	} else {
		offset = (parseInt(page - 1) * 4);
	}

	Article.findAndCountAll({
		limit: 4,
		offset: offset,
		order: [
			['id', 'DESC']
		]
	}).then(function(a){
		var next;
		if (offset+4 >= a.count) {
			next = false;
		} else {
			next = true;
		}
		var result = {
			page: parseInt(page),
			next: next,
			articles: a
		}
		Category.findAll().then(function(c){
			res.render("admin/articles/page", {result: result, categories: c});
		});
	});

});

module.exports = router;