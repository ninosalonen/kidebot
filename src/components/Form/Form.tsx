import { ChangeEvent, useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { writeTextFile, readTextFile, BaseDirectory } from '@tauri-apps/api/fs'

import Guide from '../Guide/Guide'
import { popNotification } from '../../helpers/helpers'
import styles from './Form.module.css'

const Form = () => {
	const [token, setToken] = useState('')
	const [url, setUrl] = useState('')
	const [include, setInclude] = useState('')
	const [exclude, setExclude] = useState('')
	const [getMax, setGetMax] = useState(true)

	const [cancel, setCancel] = useState(false)
	const [notif, setNotif] = useState('')
	const [guide, setGuide] = useState(false)

	useEffect(() => {
		readTextFile('.env.token', {
			dir: BaseDirectory.Desktop,
		})
			.then((data) => {
				setToken(data)
			})
			.catch((_) =>
				popNotification(
					setNotif,
					'Voit tallentaa tokenisi oikeasta yläkulmasta!'
				)
			)
	}, [])

	const handleTokenSave = async () => {
		try {
			await writeTextFile('.env.token', token, {
				dir: BaseDirectory.Desktop,
			})
			popNotification(setNotif, 'Token tallennettu!')
		} catch (e: any) {
			popNotification(setNotif, `Jokin meni pieleen: ${e}`)
		}
	}

	const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
		const get_max = e.target.value === 'true'
		get_max ? setGetMax(true) : setGetMax(false)
	}

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
				Event URL*
				<input
					className={styles.formField}
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="https://kide.app/events/cbay-1385-123..."
					autoCorrect="off"
				/>
			</label>

			<label className={styles.formLabel}>
				Tavoiteliput
				<input
					className={styles.formField}
					value={include}
					onChange={(e) => setInclude(e.target.value)}
					placeholder="e4,e3"
					autoCorrect="off"
				/>
			</label>

			<label className={styles.formLabel}>
				Poissulje
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
				disabled={cancel}
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
					setNotif('Odotetaan lippuja... (Sulje ohjelma jos haluat peruuttaa)')
					setCancel(true)
					invoke('main_tickets', {
						token,
						url,
						strInclude: include,
						strExclude: exclude,
						getMax,
					})
						.then((message) => {
							if (typeof message === 'string') {
								setNotif(message)
								setCancel(false)
							}
						})
						.catch((e) => {
							popNotification(setNotif, e)
							setCancel(false)
						})
				}}
			>
				Hae lippuja
			</button>

			{notif.length > 0 ? <p className={styles.formNotif}>{notif}</p> : ''}
		</form>
	)
}

export default Form
