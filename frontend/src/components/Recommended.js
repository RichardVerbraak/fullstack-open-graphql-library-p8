import React from 'react'
import { useQuery } from '@apollo/client'

const Recommended = () => {
	const {} = useQuery()

	return (
		<div>
			<h2>recommendations</h2>

			<p>books in your favorite genre</p>

			<table></table>
		</div>
	)
}

export default Recommended
