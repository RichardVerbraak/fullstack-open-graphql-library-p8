import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { GET_BOOKS } from '../queries'

const Books = () => {
	const { data } = useQuery(GET_BOOKS)
	const [filter, setFilter] = useState(null)

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
						data.allBooks
							.filter((book) => {
								return filter ? book.genres.includes(filter) : book
							})
							.map((book) => {
								return (
									<tr key={book.title}>
										<td>{book.title}</td>
										<td>{book.author}</td>
										<td>{book.published}</td>
									</tr>
								)
							})}
				</tbody>
			</table>

			<div>
				{data &&
					data.allBooks
						.reduce((initialValue, currentGenre) => {
							return [...initialValue, ...currentGenre.genres]
						}, [])
						.sort()
						.filter((genres, i, arr) => {
							return genres !== arr[i - 1]
						})
						.map((genre) => {
							return (
								<button
									onClick={() => {
										setFilter(genre)
									}}
									key={genre}
								>
									{genre}
								</button>
							)
						})}
				<button
					onClick={() => {
						setFilter(null)
					}}
				>
					All Books
				</button>
			</div>
		</div>
	)
}

export default Books
