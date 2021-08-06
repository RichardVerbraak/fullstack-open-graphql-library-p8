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
		bookCount: (root, args) => {
			// This function runs for every author
			// it checks if the name (root author object name) is the same as the books author
			// filter then returns an array with only those books and returns the length of them
			const count = books.filter((book) => {
				return book.author === root.name
			})

			return count.length
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
				const newAuthor = await Author.create({
					name: author,
					born: null,
				})

				const newBook = await Book.create({
					title,
					published,
					genres,
					author: newAuthor._id,
				})

				return newBook
			} else {
				const newBook = await Book.create({
					title,
					published,
					genres,
					author: authorExists._id,
				})

				return newBook
			}
		},

		editAuthor: (root, args) => {
			const foundAuthor = authors.find((author) => {
				return author.name === args.name
			})

			if (!foundAuthor) {
				return null
			}

			foundAuthor.born = args.setBornTo

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
