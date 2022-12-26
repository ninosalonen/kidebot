import { ChangeEvent, useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import {
	writeTextFile,
	readTextFile,
	BaseDirectory,
	createDir,
} from '@tauri-apps/api/fs'

import Guide from '../Guide/Guide'
import styles from './Form.module.css'

// Set notifications that disappear after
const popNotification = (
	setter: React.Dispatch<React.SetStateAction<string>>,
	msg: string
) => {
	setter(msg)
	setTimeout(() => {
		setter('')
	}, 6000)
}

const Form = () => {
	// User input
	const [token, setToken] = useState('')
	const [url, setUrl] = useState('')
	const [include, setInclude] = useState('')
	const [exclude, setExclude] = useState('')
	const [getMax, setGetMax] = useState(true)

	const [disableButton, setDisableButton] = useState(false)
	const [notification, setNotification] = useState('')
	const [guideOpen, setGuideOpen] = useState(false)

	// When app is launched, try to read the saved token from a file
	useEffect(() => {
		readTextFile('token', {
			dir: BaseDirectory.AppData,
		})
			.then((data) => {
				setToken(data)
			})
			.catch((_) =>
				popNotification(
					setNotification,
					'Voit tallentaa tokenisi oikeasta yläkulmasta!'
				)
			)
	}, [])

	// Save token to a file, called when the SSD emoji is pressed.
	const handleTokenSave = async () => {
		try {
			await createDir('', { dir: BaseDirectory.AppData, recursive: true })
			await writeTextFile('token', token, {
				dir: BaseDirectory.AppData,
			})
			popNotification(setNotification, 'Token tallennettu!')
		} catch (e: any) {
			popNotification(setNotification, `Jokin meni pieleen: ${e}`)
		}
	}

	const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
		const get_max = e.target.value === 'true'
		get_max ? setGetMax(true) : setGetMax(false)
	}

	if (guideOpen) return <Guide setGuide={setGuideOpen} />

	return (
		<form className={styles.form}>
			<button
				className={styles.guideBtn}
				type="button"
				onClick={() => setGuideOpen(true)}
			>
				❔
			</button>
			<button
				className={styles.tokenBtn}
				type="button"
				onClick={() => handleTokenSave()}
			>
				💾
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
				Tapahtuman URL*
				<input
					className={styles.formField}
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="https://kide.app/events/cbay-1385-123..."
					autoCorrect="off"
				/>
			</label>

			<label className={styles.formLabel}>
				Halutut liput
				<input
					className={styles.formField}
					value={include}
					onChange={(e) => setInclude(e.target.value)}
					placeholder="e4,e3"
					autoCorrect="off"
				/>
			</label>

			<label className={styles.formLabel}>
				Karsittavat liput
				<input
					className={styles.formField}
					value={exclude}
					onChange={(e) => setExclude(e.target.value)}
					placeholder="deluxe,a2"
					autoCorrect="off"
				/>
			</label>

			<div>
				<label className={styles.formRadio}>
					<input
						type="radio"
						value="true"
						checked={getMax}
						onChange={handleRadioChange}
					/>
					Maksimi
				</label>

				<label className={styles.formRadio}>
					<input
						type="radio"
						value="false"
						checked={!getMax}
						onChange={handleRadioChange}
					/>
					1 lippu
				</label>
			</div>

			<button
				disabled={disableButton}
				type="button"
				className={styles.formBtn}
				onClick={() => {
					if (token.length === 0 || url.length === 0) {
						popNotification(
							setNotification,
							'Kentät Token ja Tapahtuman URL ovat pakollisia!'
						)
						return
					}
					setNotification(
						'Odotetaan lippuja... (Sulje ohjelma jos haluat peruuttaa)'
					)
					setDisableButton(true)

					// Call Rust function to handle getting the tickets.
					invoke('main_tickets', {
						token,
						url,
						strInclude: include,
						strExclude: exclude,
						getMax,
					})
						.then((message) => {
							if (typeof message === 'string') {
								setNotification(message)
								setDisableButton(false)
							}
						})
						.catch((e) => {
							popNotification(setNotification, e)
							setDisableButton(false)
						})
				}}
			>
				Hae lippuja
			</button>

			{notification.length > 0 ? (
				<p className={styles.formNotif}>{notification}</p>
			) : (
				''
			)}
		</form>
	)
}

export default Form
