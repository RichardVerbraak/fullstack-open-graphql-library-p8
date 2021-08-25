import React, { useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { USER_DETAILS, GET_BOOKS } from '../queries'

const Recommended = () => {
	const { data } = useQuery(USER_DETAILS)

	const [getBooks, { data: favoriteGenreBooks }] = useLazyQuery(GET_BOOKS)

	// Fetches the user's favorite genre books after his user details query has been made
	useEffect(() => {
		if (data) {
			getBooks({
				variables: { genre: data.me.favoriteGenre },
			})
		}
		// eslint-disable-next-line
	}, [data])

	return (
		<div>
			<h2>recommendations</h2>

			<p>books in your favorite genre {data && data.me.favoriteGenre}</p>

			{favoriteGenreBooks && (
				<table>
					<tbody>
						<tr>
							<th></th>
							<th>author</th>
							<th>published</th>
						</tr>
						{favoriteGenreBooks &&
							favoriteGenreBooks.allBooks.map((book) => {
								return (
									<tr key={book.title}>
										<td>{book.title}</td>
										<td>{book.author.name}</td>
										<td>{book.published}</td>
									</tr>
								)
							})}
					</tbody>
				</table>
			)}
		</div>
	)
}

export default Recommended
