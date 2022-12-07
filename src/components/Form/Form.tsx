import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'

import Guide from '../Guide/Guide'
import { popNotification } from '../../helpers/helpers'
import styles from './Form.module.css'

const Form = () => {
	const [token, setToken] = useState('')
	const [url, setUrl] = useState('')
	const [include, setInclude] = useState('')
	const [exclude, setExclude] = useState('')
	const [getMax, setGetMax] = useState(true)

	const [notif, setNotif] = useState('')
	const [guide, setGuide] = useState(false)

	if (guide) return <Guide setGuide={setGuide} />

	return (
		<form className={styles.form}>
			<button
				className={styles.guideBtn}
				type="button"
				onClick={() => setGuide(true)}
			>
				?
			</button>

			<label className={styles.formLabel}>
				Token*
				<textarea
					rows={5}
					className={`${styles.formField}`}
					value={token}
					onChange={(e) => setToken(e.target.value)}
					placeholder={'"ey12345...'}
					autoCorrect="off"
				/>
			</label>

			<label className={styles.formLabel}>
				Event URL*
				<input
					className={styles.formField}
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="https://kide.app/events/123-asd"
					autoCorrect="off"
				/>
			</label>

			<label className={styles.formLabel}>
				Tavoiteliput
				<input
					className={styles.formField}
					value={include}
					onChange={(e) => setInclude(e.target.value)}
					placeholder="jvg,gatorade"
					autoCorrect="off"
				/>
			</label>

			<label className={styles.formLabel}>
				Poissulje
				<input
					className={styles.formField}
					value={exclude}
					onChange={(e) => setExclude(e.target.value)}
					placeholder="william,doris"
					autoCorrect="off"
				/>
			</label>

			<div>
				<label className={styles.formRadio}>
					<input
						type="radio"
						checked={getMax}
						onClick={() => setGetMax(true)}
					/>
					Max tickets
				</label>

				<label className={styles.formRadio}>
					<input
						type="radio"
						checked={!getMax}
						onClick={() => setGetMax(false)}
					/>
					1 ticket
				</label>
			</div>

			<button
				type="button"
				className={styles.formBtn}
				onClick={() => {
					if (token.length === 0 || url.length === 0) {
						popNotification(
							setNotif,
							'Kentät Token ja Event URL ovat pakollisia!'
						)
						return
					}
					setNotif('Odotetaan lippuja...')
					invoke('get_tickets', { token, url, include, exclude, getMax }).then(
						(message) => {
							if (typeof message === 'string') {
								popNotification(setNotif, message)
							}
						}
					)
				}}
			>
				Hae lippuja
			</button>

			{notif.length > 0 ? <p className={styles.formNotif}>{notif}</p> : ''}
		</form>
	)
}

export default Form
