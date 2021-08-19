import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
	uri: 'http://localhost:4000',
})

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('token')

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : null,
		},
	}
})

const client = new ApolloClient({
	link: { ...authLink, ...httpLink },
	cache: new InMemoryCache(),
})

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
)
