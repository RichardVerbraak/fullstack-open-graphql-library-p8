import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'

const App = () => {
	const [token, setToken] = useState(null)
	const [page, setPage] = useState('authors')

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
