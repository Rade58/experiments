import React from 'react'
// import './styles.css' not going to use them becuse
// going to use tailwind

export const metadata = {
	description: 'A blank template using Payload in a Next.js app.',
	title: 'Payload Blank Template',
}
// eslint-disable-next-line
export default async function RootLayout(props: { children: React.ReactNode }) {
	const { children } = props

	return (
		<html lang="en">
			<body>
				<main>{children}</main>
			</body>
		</html>
	)
}
