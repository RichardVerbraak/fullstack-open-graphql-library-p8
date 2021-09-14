const mongoose = require('mongoose')

const authorSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		minLength: 4,
	},
	born: {
		type: Number,
	},
	writtenBooks: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Book',
		},
	],
})

module.exports = mongoose.model('Author', authorSchema)
