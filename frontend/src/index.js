import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { setContext } from '@apollo/client/link/context'

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
	split,
} from '@apollo/client'

// Setup for subscriptions (requires websockets)
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

const wsLink = new WebSocketLink({
	uri: 'ws://localhost:4000/subscriptions',
	options: {
		reconnect: true,
	},
})

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

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query)
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		)
	},
	wsLink,
	httpLink
)

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: authLink.concat(splitLink),
})

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
)
