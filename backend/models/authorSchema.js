const mongoose = require('mongoose')

const authorSchema = mongoose.Schema({
	name: { type: String, required: true, unique: true },
	born: { type: Number, require: true },
})

module.exports = mongoose.model('Author', authorSchema)
