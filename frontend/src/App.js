import { useApolloClient } from '@apollo/client'
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'

const App = () => {
	const [token, setToken] = useState(null)
	const [page, setPage] = useState('authors')
	const client = useApolloClient()

	const logout = () => {
		setToken(null)
		localStorage.removeItem('token')
		client.resetStore()
	}

	return (
		<div>
			{!token ? (
				<LoginForm setToken={setToken} />
			) : (
				<div>
					<div>
						<button onClick={() => setPage('authors')}>authors</button>
						<button onClick={() => setPage('books')}>books</button>
						<button onClick={() => setPage('add')}>add book</button>
						<button onClick={logout}>Logout</button>
					</div>

					{page === 'authors' && <Authors />}
					{page === 'books' && <Books />}
					{page === 'add' && <NewBook />}
				</div>
			)}
		</div>
	)
}

export default App
