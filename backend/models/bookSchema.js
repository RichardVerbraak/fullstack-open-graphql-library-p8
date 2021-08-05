const { Schema } = require('mongoose')

const bookSchema = new Schema({
	title: { type: String, required: true },
	published: { type: String, required: true },
	author: { type: String, required: true },
	id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
	genres: [{ type: String }],
})

module.exports = bookSchema
