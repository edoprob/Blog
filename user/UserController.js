const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/users", adminAuth , function(req, res){
    
    User.findAll().then(function(temp){


        res.render("admin/users/index", {users: temp});
    });
});

router.get("/admin/users/create", adminAuth , function(req, res){
    res.render("admin/users/create");
});

router.post("/users/create", adminAuth , function(req, res){
    var l = req.body.login;
    var p = req.body.pass;

    User.findOne({ where: { login: l } }).then(function(temp){
        if (temp == undefined) {

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(p, salt);

            User.create({
                login: l,
                pass: hash
            }).then(function(){
                res.redirect("/");
            }).catch(function(err){
                res.redirect("/");
            });

        } else {
         res.redirect("/admin/users/create");   
        }
    });    
});

router.get("/login", function(req, res){
    res.render("admin/users/login")
})

router.post("/authenticate", function(req, res){
    var login = req.body.login;
    var pass = req.body.pass;

    User.findOne({
        where: {
            login: login
        }
    }).then(function(user){
        if (user != undefined) {
            
            var correct = bcrypt.compareSync(pass, user.pass);
            if (correct) {
                req.session.user = {
                    id: user.id,
                    login: user.login
                }
                res.redirect("/admin/articles");
            } else {
                res.redirect("/login")
            }            
        } else {
            res.redirect("/login");
        }
    });
});

router.get("/logout", function(req, res){
    req.session.user = undefined;
    res.redirect("/");
});


module.exports = router;