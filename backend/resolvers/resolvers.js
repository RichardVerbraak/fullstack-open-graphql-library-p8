const { UserInputError } = require('apollo-server')
const Book = require('../models/bookSchema')
const Author = require('../models/authorSchema')

const resolvers = {
	Author: {
		bookCount: async (root, args) => {
			// Finds all Books with the author's id
			// $in could be read as includes, the weird syntax is just due to mongoose API
			const author = await Book.find({ author: { $in: [root._id] } })

			return author.length
		},
	},

	Query: {
		bookCount: async () => {
			const booksLength = await Book.countDocuments()

			return booksLength
		},
		authorCount: async () => {
			const authorsLength = await Author.countDocuments()

			return authorsLength
		},
		allBooks: async (root, args) => {
			if (args.genre) {
				// Finds the books by genre
				const booksByGenre = await Book.find({
					genres: { $in: [args.genre] },
				})

				return booksByGenre
			}

			// Finds all books when no args
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

			try {
				if (!authorExists) {
					// Add author if he doesn't exist and reference new author id in the book
					// If he does, reference the existing author
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
					// If author already exists, create only the book
					let newBook = await Book.create({
						title,
						published,
						genres,
						author: authorExists._id,
					})

					newBook = await Book.findById(newBook._id).populate('author')

					return newBook
				}
			} catch (error) {
				throw new UserInputError(error.message, { invalidArgs: args })
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

module.exports = resolvers
