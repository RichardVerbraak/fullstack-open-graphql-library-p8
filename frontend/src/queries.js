import { gql } from '@apollo/client'

const GET_AUTHORS = gql`
	query {
		allAuthors {
			name
			bookCount
			born
			id
		}
	}
`

const GET_BOOKS = gql`
	query getBooks($name: String, $genre: String) {
		allBooks(name: $name, genre: $genre) {
			title
			published
			genres
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

const EDIT_AUTHOR = gql`
	mutation editBirth($name: String!, $born: Int!) {
		editAuthor(name: $name, setBornTo: $born) {
			name
			born
			id
		}
	}
`

export { GET_AUTHORS, GET_BOOKS, ADD_BOOK, EDIT_AUTHOR }
