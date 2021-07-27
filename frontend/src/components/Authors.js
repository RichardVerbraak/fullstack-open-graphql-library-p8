import React from 'react'
import { gql, useQuery } from '@apollo/client'

const getAuthors = gql`
	query {
		allAuthors {
			name
			bookCount
			born
		}
	}
`

const Authors = () => {
	const { data } = useQuery(getAuthors)

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{data &&
						data.allAuthors.map((authors) => (
							<tr key={authors.name}>
								<td>{authors.name}</td>
								<td>{authors.born}</td>
								<td>{authors.bookCount}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}

export default Authors
