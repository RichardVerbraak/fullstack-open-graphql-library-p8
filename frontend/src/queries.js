import { gql } from '@apollo/client'

const getAuthors = gql`
	query {
		allAuthors {
			name
			bookCount
			born
		}
	}
`

const getBooks = gql`
	query {
		allBooks {
			title
			author
			published
		}
	}
`

export { getAuthors, getBooks }
