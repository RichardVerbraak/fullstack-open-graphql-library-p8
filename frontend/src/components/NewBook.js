import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, GET_BOOKS } from '../queries'

const NewBook = () => {
	const [title, setTitle] = useState('')
	const [author, setAuhtor] = useState('')
	const [published, setPublished] = useState(0)
	const [genre, setGenre] = useState('')
	const [genres, setGenres] = useState([])

	const [addBook] = useMutation(ADD_BOOK, {
		update: (cache, { data: { addBook } }) => {
			try {
				const storedData = cache.readQuery({ query: GET_BOOKS })

				cache.writeQuery({
					query: GET_BOOKS,
					data: {
						...storedData,
						allBooks: [...storedData.allBooks, addBook],
					},
				})
			} catch (error) {
				console.log(error)
			}
		},
	})

	const submitHandler = async (event) => {
		event.preventDefault()

		addBook({ variables: { title, author, published, genres } })

		setTitle('')
		setPublished('')
		setAuhtor('')
		setGenres([])
		setGenre('')
	}

	const addGenre = () => {
		setGenres([...genres, genre])
		setGenre('')
	}

	return (
		<div>
			<form onSubmit={submitHandler}>
				<div>
					title
					<input
						value={title}
						onChange={({ target }) => setTitle(target.value)}
					/>
				</div>
				<div>
					author
					<input
						value={author}
						onChange={({ target }) => setAuhtor(target.value)}
					/>
				</div>
				<div>
					published
					<input
						type='number'
						value={published || ''}
						onChange={({ target }) => setPublished(parseInt(target.value))}
					/>
				</div>
				<div>
					<input
						value={genre}
						onChange={({ target }) => setGenre(target.value)}
					/>
					<button onClick={addGenre} type='button'>
						add genre
					</button>
				</div>
				<div>genres: {genres.join(' ')}</div>
				<button type='submit'>create book</button>
			</form>
		</div>
	)
}

export default NewBook
