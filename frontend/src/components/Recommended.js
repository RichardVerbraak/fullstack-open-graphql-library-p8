import React from 'react'
import { useQuery } from '@apollo/client'
import { USER_DETAILS } from '../queries'

const Recommended = () => {
	const { data } = useQuery(USER_DETAILS)

	console.log(data)

	return (
		<div>
			<h2>recommendations</h2>

			<p>books in your favorite genre {data && data.me.favoriteGenre}</p>

			<table></table>
		</div>
	)
}

export default Recommended
