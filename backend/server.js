// Apollo
const { ApolloServer } = require('apollo-server')
const typeDefs = require('./typeDefs/typeDefs')
const resolvers = require('./resolvers/resolvers')

// DB connect
const connectDB = require('./config/db')

// Mongoose Models
const Book = require('./models/bookSchema')
const Author = require('./models/authorSchema')
const User = require('./models/userSchema')

// Seeder data
const { books, authors } = require('./seederData')

// JWT Token
const jwt = require('jsonwebtoken')

// Access to .env variables
require('dotenv').config()

connectDB()

const importData = async () => {
	await Author.insertMany(authors)
	await Book.insertMany(books)
}

const deleteData = async () => {
	await Book.deleteMany()
	await Author.deleteMany()
}

if (process.argv[2] === 'import') {
	importData()
	console.log('Import succesful')
}

if (process.argv[2] === 'delete') {
	deleteData()
	console.log('Delete succesful')
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		const auth = req ? req.headers.authorization : null

		const bearer = auth && auth.split(' ')[0].toLowerCase()

		// Checks for token
		if (auth && bearer) {
			// Verify token
			const decodedToken = jwt.verify(
				auth.split(' ')[1],
				process.env.JWT_SECRET
			)

			// Find user and populate the friends field
			const loggedInUser = await User.findById(decodedToken.id)

			return { loggedInUser }
		}
	},
})

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`)
})
