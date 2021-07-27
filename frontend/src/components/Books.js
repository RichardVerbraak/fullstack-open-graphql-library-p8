import { useQuery } from '@apollo/client'
import React from 'react'
import { getBooks } from '../queries'

const Books = () => {
	const { data } = useQuery(getBooks)

	return (
		<div>
			<h2>books</h2>

			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{data &&
						data.allBooks.map((book) => (
							<tr key={book.title}>
								<td>{book.title}</td>
								<td>{book.author}</td>
								<td>{book.published}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	)
}

export default Books
