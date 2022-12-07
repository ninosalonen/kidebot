import React from 'react'
import styles from './Guide.module.css'

type PropsType = {
	setGuide: React.Dispatch<React.SetStateAction<boolean>>
}

const Guide = ({ setGuide }: PropsType) => {
	return (
		<div className={styles.guide}>
			<button
				className={styles.guideBtn}
				type="button"
				onClick={() => setGuide(false)}
			>
				X
			</button>
			<h1>Ohjeet</h1>
		</div>
	)
}

export default Guide
