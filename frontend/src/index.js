import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { setContext } from '@apollo/client/link/context'

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
} from '@apollo/client'

const authLink = setContext((_, { headers }) => {
	// Get token from storage
	const token = localStorage.getItem('token')

	// Return the headers object to apollo client link object
	return {
		headers: {
			...headers,
			authorization: token ? `bearer ${token}` : '',
		},
	}
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: authLink.concat(httpLink),
})

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
)
