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

export { getAuthors }
