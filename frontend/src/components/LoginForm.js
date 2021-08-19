import { useMutation } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [login, result] = useMutation(LOGIN, {
		onError: (error) => {
			console.log(error)
		},
	})

	const submit = (e) => {
		e.preventDefault()

		login({ variables: { username, password } })
	}

	useEffect(() => {
		if (result.data) {
			setToken(result.data.login.value)
			localStorage.setItem('token', result.data.login.value)
		}
		//eslint-disable-next-line
	}, [result.data])

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
				<button type='submit'>Submit</button>
			</form>
		</div>
	)
}

export default LoginForm
