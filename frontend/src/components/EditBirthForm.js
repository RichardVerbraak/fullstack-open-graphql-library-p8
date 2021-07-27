import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

const EditBirthForm = () => {
	const [name, setName] = useState('')
	const [born, setBorn] = useState('')

	const [editBirthyear] = useMutation()

	const submitHandler = (e) => {
		e.preventDefault()

		editBirthyear({ variables: { name, born } })

		setName('')
		setBorn('')
	}

	return (
		<div>
			<h2>Set birthyear</h2>
			<form onSubmit={submitHandler}>
				<label>
					name
					<input
						type='text'
						name='name'
						onChange={(e) => {
							setName(e.target.value)
						}}
					/>
				</label>

				<label>
					born
					<input
						type='number'
						name='born'
						onChange={(e) => {
							setBorn(e.target.value)
						}}
					/>
				</label>

				<button type='submit'>update author</button>
			</form>
		</div>
	)
}

export default EditBirthForm
