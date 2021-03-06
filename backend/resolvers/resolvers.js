const { UserInputError, AuthenticationError } = require('apollo-server-express')

// Mongo Models
const Book = require('../models/bookSchema')
const Author = require('../models/authorSchema')
const User = require('../models/userSchema')

// Token
const jwt = require('jsonwebtoken')

// Init use of subscriptions
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
	Author: {
		bookCount: async (root, args) => {
			// Old version (before the N+1 problem was solved)
			// Finds all Books with the author's id
			// $in could be read as includes, the weird syntax is just due to mongoose API
			// const bookCount = await Book.find({ author: { $in: [root._id] } })

			// return bookCount.length

			const author = await Author.findById(root._id).populate('writtenBooks')

			const bookCount = author.writtenBooks.length

			return bookCount
		},
	},

	Query: {
		// Returns the number of books in the DB
		bookCount: async () => {
			const booksLength = await Book.countDocuments()

			return booksLength
		},
		// Returns the number of authors in the DB
		authorCount: async () => {
			const authorsLength = await Author.countDocuments()

			return authorsLength
		},
		// // Returns all books in the DB with their author - by genre or not
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
		// Returns all authors
		allAuthors: async () => {
			const authors = await Author.find({})
			return authors
		},
		// Returns the logged in users details
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

					// Add book to the author's written books
					newAuthor.writtenBooks = [...newAuthor.writtenBooks, newBook._id]
					await newAuthor.save()

					// Set newBook to the returned populated one (can't populate on creation)
					newBook = await Book.findById(newBook._id).populate('author')

					// Return the newBook details to the subscribers
					pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

					return newBook
				} else {
					// If author already exists, create only the book
					let newBook = await Book.create({
						title,
						published,
						genres,
						author: authorExists._id,
					})

					// Add book to the author's written books
					authorExists.writtenBooks = [
						...authorExists.writtenBooks,
						newBook._id,
					]
					await authorExists.save()

					newBook = await Book.findById(newBook._id).populate('author')

					// Return the newBook details to the subscribers
					pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

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
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
		},
	},
}

module.exports = resolvers
