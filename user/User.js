const Sequelize = require("sequelize");
const connection = require("../database/database.js");

const User = connection.define("users", {
	login: {
		type: Sequelize.STRING,
		allowNull: false
	},
	pass: {
		type: Sequelize.STRING,
		allowNull: false
	}
});
module.exports = User;