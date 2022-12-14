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
				❌
			</button>
			<h1 className={styles.guideh1}>Ohjeet</h1>
			<h2 className={styles.guideh2}>Token</h2>
			<p className={styles.guideText}>
				Löydät tämän selaimen muistista, kun olet kirjautunut sisään Kide
				appiin. Voit syöttää tokenin hipsukoilla tai ilman. Token menee vanhaksi
				jossain vaiheessa, joten hae uusi token aina muutaman kuukauden välein.
				{'\n\n'}
				Jos et näe safarilla "inspect element"-painiketta: Safari Settings,
				click advanced, then select "Show Develop menu in menu bar"
			</p>
			<img className={styles.guideImg} src="kuva2.png"></img>
			<img className={styles.guideImg} src="kuva1.png"></img>
			<h2 className={styles.guideh2}>Tapahtuman URL</h2>
			<p className={styles.guideText}>
				Tarkista, että se on muodossa:
				https://kide.app/events/f155c3c1-dd29-4f32-9fb4-3da5fd6f3c4a
			</p>
			<h2 className={styles.guideh2}>Halutut liput</h2>
			<p className={styles.guideText}>
				Jos haluat joitain tiettyjä lippuja, käytä tätä. Sinun täytyy arvella,
				mitä sanoja lipun nimessä tulee olemaan, ja erottaa sanat pilkulla. Voit
				jättää tämän tyhjäksi, jos lipuilla ei ole väliä.{'\n\n'}Esim. jos
				tiedät, että JVG esiintyy Gatorade Centerillä, kirjoitat: jvg,gatorade{' '}
				{'\n\n'}
				Jos arvatut sanat täsmäävät yhteen tai useampaan lippuun, ohjelma ottaa
				ainoastaan kyseisiä lippuja. Jos yhtään lippua ei tullut myyntiin, jonka
				nimessä on kyseisiä sanoja, siirtyy ohjelma hakemaan satunnaisesti
				kaikkia lippuja.
			</p>
			<h2 className={styles.guideh2}>Karsittavat liput</h2>
			<p className={styles.guideText}>
				Jos haluat olla saamatta joitain tiettyjä lippuja, käytä tätä. Sinun
				täytyy arvella, mitä sanoja lipun nimessä tulee olemaan, ja erottaa
				sanat pilkulla. Voit jättää tämän myös tyhjäksi.{'\n\n'}Esim. jos kaikki
				muut liput käyvät, paitsi torstain ja perjantain liput, kirjoita:
				torstai,perjantai{'\n\n'}Jos suljet kaikki liput pois, ohjelma siirtyy
				hakemaan satunnaisesti kaikkia lippuja.
			</p>
			<h2 className={styles.guideh2}>Hae lippuja</h2>
			<p className={styles.guideText}>
				Kun olet klikannut nappia, työsi on tehty. Näet alla kaikki
				onnistuneesti ostoskoriin lisätyt liput.{'\n\n'}
				On suositeltavaa, että aloitat lippujen hakemisen n. 5 sekuntia ennen
				lipunmyynnin alkua. En tiedä antaako Kide bännejä suuresta määrästä
				pyyntöjä, mutta ei kannata lähteä kokeilemaan!
			</p>
		</div>
	)
}

export default Guide
