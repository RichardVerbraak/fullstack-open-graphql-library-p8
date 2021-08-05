const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
	title: { type: String, required: true, unique: true },
	published: { type: Number, required: true },
	author: { type: String, required: true },
	genres: [{ type: String }],
})

module.exports = mongoose.model('Book', bookSchema)
