const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/categories/new", adminAuth , function(req, res){
	res.render("admin/categories/new")
});

router.post("/categories/save", function(req, res){
	var temp = req.body.title;
	if (temp != undefined) {
		Category.create({
			title: temp,
			slug: slugify(temp)
		}).then(function(){
			res.redirect("/admin/categories");
		});
	} else {
		res.redirect("/admin/categories/new");
	}
});

router.get("/admin/categories", adminAuth , function(req, res){
	Category.findAll().then(function(temp){
		res.render("admin/categories/index", {categories: temp})
	})
});

router.post("/categories/delete", function(req, res){
	var temp = req.body.id;
	if (temp != undefined) {
		if (!isNaN(temp)) {
			Category.destroy({
				where: {
					id: temp
				}
			});
			res.redirect("/admin/categories")
		} else { // NaN
			res.redirect("/admin/categories")
		}
	} else {// null
		res.redirect("/admin/categories")
	}
});

router.get("/admin/categories/edit/:id", adminAuth , function(req, res){
	var id = req.params.id;
	if (isNaN(id)) {
		res.redirect("/admin/categories");
	}
	Category.findByPk(id).then(function(temp){
		if (temp != undefined) {
			res.render("admin/categories/edit", {category: temp});
		} else {
			res.redirect("/admin/categories");
		}
	}).catch(function(erro){
		res.redirect("/admin/categories");
	});
});

router.post("/categories/update", function(req, res){
	var id = req.body.id;
	var title = req.body.title;

	Category.update({
		title: title, 
		slug: slugify(title)
	}, {
		where: {
			id: id
		}
	}).then(function(){
		res.redirect("/admin/categories")
	});
});
	

module.exports = router;