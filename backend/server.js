// Apollo
const { ApolloServer, gql } = require('apollo-server')

// DB connect
const connectDB = require('./config/db')

// Mongoose Models
const Book = require('./models/bookSchema')
const Author = require('./models/authorSchema')

// Seeder data
const { books, authors } = require('./seederData')

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

console.log(process.env.argv)

if (process.argv[2] === 'import') {
	importData()
	console.log('Import succesful')
}

if (process.argv[2] === 'delete') {
	deleteData()
	console.log('Delete succesful')
}

const typeDefs = gql`
	type Book {
		title: String!
		author: Author!
		published: Int!
		genres: [String!]
		id: ID!
	}

	type Author {
		name: String!
		bookCount: Int!
		born: String
		id: ID!
	}

	type Query {
		bookCount: Int!
		authorCount: Int!
		allBooks(name: String, genre: String): [Book!]!
		allAuthors: [Author!]!
	}

	type Mutation {
		addBook(
			title: String!
			author: String!
			published: Int!
			genres: [String!]!
		): Book
		editAuthor(name: String!, setBornTo: Int!): Author
	}
`

const resolvers = {
	Author: {
		bookCount: async (root, args) => {
			// Finds all Books with the author's id
			const author = await Book.find({ author: { $in: [root._id] } })

			return author.length
		},
	},

	Query: {
		bookCount: async () => {
			const booksLength = await Book.countDocuments()
			console.log(booksLength)
			return booksLength
		},
		authorCount: async () => {
			const authorsLength = await Author.countDocuments()
			return authorsLength
		},
		allBooks: async (root, args) => {
			// if (args.name && args.genre) {
			// 	const filteredBooks = books
			// 		.filter((book) => {
			// 			return book.author === args.name
			// 		})
			// 		.filter((book) => {
			// 			return book.genres.includes(args.genre.toLowerCase())
			// 		})

			// 	return filteredBooks
			// }

			// if (args.name) {
			// 	const booksByAuthor = books.filter((book) => {
			// 		return book.author === args.name
			// 	})

			// 	return booksByAuthor
			// }

			// if (args.genre) {
			// 	const booksByGenre = books.filter((book) => {
			// 		return book.genres.includes(args.genre.toLowerCase())
			// 	})

			// 	return booksByGenre
			// }

			const books = await Book.find({})

			return books
		},
		allAuthors: async () => {
			const authors = await Author.find({})
			return authors
		},
	},

	Mutation: {
		addBook: async (root, args) => {
			const { title, author, published, genres } = args

			// Find if authors exists
			const authorExists = await Author.findOne({ name: author })

			// Add author if he doesn't exist and reference new author id in the book
			// If he does, reference the existing author
			if (!authorExists) {
				// Create author
				const newAuthor = await Author.create({
					name: author,
					born: null,
				})

				// Create book
				let newBook = await Book.create({
					title,
					published,
					genres,
					author: newAuthor._id,
				})

				// Set newBook to the returned populated one (can't populate on creation)
				newBook = await Book.findById(newBook._id).populate('author')

				return newBook
			} else {
				let newBook = await Book.create({
					title,
					published,
					genres,
					author: authorExists._id,
				})

				newBook = await Book.findById(newBook._id).populate('author')

				return newBook
			}
		},

		editAuthor: async (root, args) => {
			const foundAuthor = await Author.findOne({ name: args.name })

			if (!foundAuthor) {
				return null
			}

			foundAuthor.born = args.setBornTo

			await foundAuthor.save()

			return foundAuthor
		},
	},
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`)
})
