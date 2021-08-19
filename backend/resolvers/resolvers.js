const { UserInputError, AuthenticationError } = require('apollo-server')

const Book = require('../models/bookSchema')
const Author = require('../models/authorSchema')

const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')

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
				}).populate('author')

				return booksByGenre
			}

			// Finds all books when no args
			const books = await Book.find({}).populate('author')

			return books
		},
		allAuthors: async () => {
			const authors = await Author.find({})
			return authors
		},

		me: (root, args, context) => {
			const user = context.loggedInUser

			return user
		},
	},

	Mutation: {
		addBook: async (root, args, context) => {
			const { title, author, published, genres } = args
			const loggedInUser = context.loggedInUser

			if (!loggedInUser) {
				throw new AuthenticationError('Not authorized')
			}

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

		editAuthor: async (root, args, context) => {
			const loggedInUser = context.loggedInUser

			if (!loggedInUser) {
				throw new AuthenticationError('Not authorized')
			}

			const foundAuthor = await Author.findOne({ name: args.name })

			if (!foundAuthor) {
				return null
			}

			foundAuthor.born = args.setBornTo

			await foundAuthor.save()

			return foundAuthor
		},

		createUser: async (root, args) => {
			const { username, favoriteGenre } = args

			try {
				// All users will have the password of 'secret'
				const user = await User.create({
					username,
					favoriteGenre,
					password: 'secret',
				})

				return user
			} catch (error) {
				console.log(error.message)
				throw new UserInputError(error.message)
			}
		},
		// Login, query or mutation? https://stackoverflow.com/questions/50189364/shouldnt-the-login-be-a-query-in-graphql
		login: async (root, args) => {
			const { username, password } = args

			try {
				const user = await User.findOne({ username })

				if (user && password === 'secret') {
					const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

					return { value: token }
				}
			} catch (error) {
				console.log(error.message)
				throw new UserInputError(error.message)
			}
		},
	},
}

module.exports = resolvers
