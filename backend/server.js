// Apollo
const { ApolloServer } = require('apollo-server-express')

// Setting up subscription support
const express = require('express')
const http = require('http')

const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { makeExecutableSchema } = require('@graphql-tools/schema')

// GraphQL types and resolvers
const typeDefs = require('./typeDefs/typeDefs')
const resolvers = require('./resolvers/resolvers')

// DB connect
const connectDB = require('./config/db')

// Mongoose Models
const Book = require('./models/bookSchema')
const Author = require('./models/authorSchema')
const User = require('./models/userSchema')

// Seeder data
const { authors } = require('./seederData')

// JWT Token
const jwt = require('jsonwebtoken')

// Access to .env variables
require('dotenv').config()

// Init MongoDB connection
connectDB()

// Logic for importing seeder data or wiping the data from the DB
const importData = async () => {
	await Author.insertMany(authors)

	//!! Directly inserting them to the DB doesn't work anymore because the author field of books should be the authors ID and not a string
	// Author field being a reference to the Author schema and ref only works via the ObjectId type
	// await Book.insertMany(books)
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

// !!! Subscription server will only listen in the gql sandbox if you start with a 'fresh' subscription operation
// Apollo Server init
const startApolloServer = async (typeDefs, resolvers) => {
	// Required logic for integrating with Express
	const app = express()
	const httpServer = http.createServer(app)

	// Setting up Subscription (doesn't take typeDefs and Resolvers but it does take an executable GraphQL schema)
	const schema = makeExecutableSchema({ typeDefs, resolvers })

	const server = new ApolloServer({
		schema,
		plugins: [
			{
				async serverWillStart() {
					return {
						async drainServer() {
							subscriptionServer.close()
						},
					}
				},
			},
		],
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

	const subscriptionServer = SubscriptionServer.create(
		{
			// This is the `schema` we just created.
			schema,
			// These are imported from `graphql`.
			execute,
			subscribe,
		},
		{
			// This is the `httpServer` we created in a previous step.
			server: httpServer,
			// This `server` is the instance returned from `new ApolloServer`.
			path: server.graphqlPath,
		}
	)

	// More required logic for integrating with Express
	await server.start()

	server.applyMiddleware({
		app,
		// By default, apollo-server hosts its GraphQL endpoint at the
		// server root. However, *other* Apollo Server packages host it at
		// /graphql. Optionally provide this to match apollo-server.
		// path: '/',
	})
	// Modified server startup
	httpServer.listen({ port: 4000 })
	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

startApolloServer(typeDefs, resolvers)
