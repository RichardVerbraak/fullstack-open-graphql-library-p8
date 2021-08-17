import { useLazyQuery } from '@apollo/client'
import React, { useState } from 'react'

const LoginForm = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [] = useLazyQuery()

	const submit = (e) => {
		e.preventDefault()
	}

	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={submit}>
				Username{' '}
				<input
					type='text'
					onChange={(e) => {
						setUsername(e.target.value)
					}}
				/>
				Password{' '}
				<input
					type='password'
					onChange={(e) => {
						setPassword(e.target.value)
					}}
				/>
			</form>
		</div>
	)
}

export default LoginForm
