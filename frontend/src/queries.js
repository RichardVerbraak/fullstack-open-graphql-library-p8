import { gql } from '@apollo/client'

const LOGIN = gql`
	mutation loginUser($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`

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
			author {
				name
				born
			}
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

const USER_DETAILS = gql`
	query Query {
		me {
			username
			favoriteGenre
			id
		}
	}
`

export { GET_AUTHORS, GET_BOOKS, ADD_BOOK, EDIT_AUTHOR, LOGIN, USER_DETAILS }
