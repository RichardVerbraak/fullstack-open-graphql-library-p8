const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},

	favoriteGenre: {
		type: String,
	},

	password: {
		type: String,
		required: true,
	},
})

module.exports = mongoose.model('User', userSchema)
