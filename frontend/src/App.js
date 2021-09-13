import { useApolloClient, useSubscription } from '@apollo/client'
import React, { useEffect, useState } from 'react'

import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Recommended from './components/Recommended'

import { ADD_BOOK_SUBSCRIPTION } from './queries'

const App = () => {
	const [token, setToken] = useState(null)
	const [page, setPage] = useState('authors')
	const client = useApolloClient()

	const logout = () => {
		setToken(null)
		localStorage.removeItem('token')
		client.resetStore()
	}

	const { data, loading } = useSubscription(ADD_BOOK_SUBSCRIPTION)

	useEffect(() => {
		if (data) {
			window.alert(`Book ${data.bookAdded.title} has been added!`)
		}
	}, [data])

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
						<button onClick={() => setPage('recommended')}>recommended</button>
						<button onClick={logout}>Logout</button>
					</div>

					{page === 'authors' && <Authors />}
					{page === 'books' && <Books />}
					{page === 'add' && <NewBook />}
					{page === 'recommended' && <Recommended />}
				</div>
			)}
		</div>
	)
}

export default App
