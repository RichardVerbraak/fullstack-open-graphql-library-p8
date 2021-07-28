import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { EDIT_AUTHOR } from '../queries'

const EditBirthForm = ({ authors }) => {
	// Name is set to the first author
	const [name, setName] = useState(authors[0].name)
	const [born, setBorn] = useState('')
	const [message, setMessage] = useState('')

	const [editBirthyear, result] = useMutation(EDIT_AUTHOR)

	const submitHandler = (e) => {
		e.preventDefault()

		editBirthyear({ variables: { name, born } })

		setName('')
		setBorn('')
	}

	useEffect(() => {
		if (result.data && result.data.editAuthor === null) {
			setMessage('User does not exist')
		}
	}, [result])

	return (
		<div>
			{message && <p style={{ color: 'red' }}>{message}</p>}
			<h2>Set birthyear</h2>
			<form onSubmit={submitHandler}>
				<div>
					<label>
						name
						<select
							onChange={(e) => {
								setName(e.target.value)
							}}
						>
							{authors.map((author) => {
								return (
									<option key={author.name} value={author.name}>
										{author.name}
									</option>
								)
							})}
						</select>
					</label>
				</div>

				<div>
					<label>
						born
						<input
							type='number'
							name='born'
							onChange={(e) => {
								setBorn(parseInt(e.target.value))
							}}
						/>
					</label>
				</div>

				<button type='submit'>update author</button>
			</form>
		</div>
	)
}

export default EditBirthForm
