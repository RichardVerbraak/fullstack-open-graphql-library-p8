import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { GET_BOOKS } from '../queries'

const Books = () => {
	const { data } = useQuery(GET_BOOKS)
	const [filter, setFilter] = useState(null)

	console.log(data)

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
										<td>{book.author.name}</td>
										<td>{book.published}</td>
									</tr>
								)
							})}
				</tbody>
			</table>

			<div>
				{data &&
					data.allBooks
						// Reduces the books genres into one genres array
						.reduce((initialValue, currentGenre) => {
							return [...initialValue, ...currentGenre.genres]
						}, [])
						//!! Important to sort in ascending order i.e [Fantasy, Fantasy, Drama]
						.sort()
						// Filter out the genre that is same as the previous genre (the genre that does not pass the test below)
						// arr is the array filter was based upon, and [i - 1] is the previous genre
						.filter((genre, i, arr) => {
							return genre !== arr[i - 1]
						})
						// Create a genre button
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
