import React from 'react'
import { useQuery } from '@apollo/client'

import { getAuthors } from '../queries'

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
