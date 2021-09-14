import { useApolloClient, useSubscription } from '@apollo/client'
import React, { useState } from 'react'

import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Recommended from './components/Recommended'

import { ADD_BOOK_SUBSCRIPTION, GET_BOOKS } from './queries'

const App = () => {
	const [token, setToken] = useState(null)
	const [page, setPage] = useState('authors')
	const client = useApolloClient()

	const logout = () => {
		setToken(null)
		localStorage.removeItem('token')
		client.resetStore()
	}

	const updateCache = (newBook) => {
		try {
			const storedData = client.readQuery({ query: GET_BOOKS })

			const existingBook = storedData.allBooks.includes(newBook)

			if (!existingBook) {
				client.writeQuery({
					query: GET_BOOKS,
					data: {
						allBooks: [...storedData.allBooks, newBook],
					},
				})
			}
		} catch (error) {
			console.log(error)
		}
	}

	// onSubscriptionData has the result so I'm using that like "useEffect"
	useSubscription(ADD_BOOK_SUBSCRIPTION, {
		onSubscriptionData: ({ subscriptionData }) => {
			const newBook = subscriptionData.data.bookAdded
			window.alert(`Book ${newBook.title} has been added!`)
			updateCache(newBook)
		},
	})

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
