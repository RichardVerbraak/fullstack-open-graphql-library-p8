import { gql } from '@apollo/client'

const GET_AUTHORS = gql`
	query {
		allAuthors {
			name
			bookCount
			born
		}
	}
`

const GET_BOOKS = gql`
	query {
		allBooks {
			title
			author
			published
		}
	}
`
const ADD_BOOK = gql`
	mutation createBook(
		$title: String!
		$author: String!
		$published: Int!
		$genres: [String!]!
	) {
		addBook(
			title: $title
			author: $author
			published: $published
			genres: $genres
		) {
			title
		}
	}
`

export { GET_AUTHORS, GET_BOOKS, ADD_BOOK }
