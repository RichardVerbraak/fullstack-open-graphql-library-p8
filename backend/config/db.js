const mongoose = require('mongoose')

// Connect to MongoDB
const connectDB = async () => {
	try {
		const connect = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useFindAndModify: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
		})

		console.log(`Connected to MongoDB on ${connect.connection.host}`)
	} catch (error) {
		console.error(`Error: ${error.message}`)
		process.exit(1)
	}
}

module.exports = connectDB
