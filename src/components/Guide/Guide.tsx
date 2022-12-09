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
			<h1 className={styles.guideh1}>Ohjeet</h1>
			<h2 className={styles.guideh2}>Käynnistys</h2>
			<p className={styles.guideText}>
				Ensimmäisen käynnistyksen yhteydessä Macillä sinun tulee antaa oikeudet
				sovellukselle: Control-click the app icon, then choose Open from the
				shortcut menu, the click Open. Jos ongelmia esiintyy, tukihenkilö
				päivystää 24/7 osoitteessa kidebot@proton.me
			</p>
			<h2 className={styles.guideh2}>Token</h2>
			<p className={styles.guideText}>
				Löydät tämän selaimen muistista, kun olet kirjautunut sisään Kide appiin
				selaimella. Voit syöttää tokenin hipsukoilla tai ilman. Token menee
				vanhaksi jossain vaiheessa. Hae aina uusi token muutaman/parin kuukauden
				jälkeen.
			</p>
			<img className={styles.guideImg} src="kuva2.png"></img>
			<p
				className={styles.guideText}
			>{`Jos et näe safarilla "inspect element"-painiketta: Safari  Settings, click advanced, then select "Show Develop menu in menu bar"`}</p>
			<img className={styles.guideImg} src="kuva1.png"></img>
			<h2 className={styles.guideh2}>Event URL</h2>
			<p className={styles.guideText}>
				Tarkista, että se on muodossa:
				https://kide.app/events/f155c3c1-dd29-4f32-9fb4-3da5fd6f3c4a
			</p>
			<h2 className={styles.guideh2}>Tavoiteliput</h2>
			<p className={styles.guideText}>
				Jos tiedät jatkoartistin esiintyvän jossain tietyssä paikassa, kirjoita
				tähän esim. artistin ja jatkopaikan nimi pilkulla erotettuna. Sanotaan,
				että tiedät JVG:n esiintyvän Gatorade centerillä. Kirjoitat:
				jvg,gatorade (Jos yhtään lippua ei tullut myyntiin, jonka nimessä on jvg
				tai gatorade, siirtyy ohjelma hakemaan satunnaisesti kaikkia lippuja)
			</p>
			<h2 className={styles.guideh2}>Poissulje</h2>
			<p className={styles.guideText}>
				Jos haluat olla saamatta joitain tiettyjä lippuja, käytä tätä. Esim. jos
				kaikki muut liput käyvät, paitsi torstain ja perjantain liput, kirjoita:
				torstai,perjantai. (Jos suljet kaikki liput pois, ohjelma siirtyy
				hakemaan satunnaisesti kaikkia lippuja)
			</p>
			<h2 className={styles.guideh2}>Hae lippuja</h2>
			<p className={styles.guideText}>
				On suositeltavaa, että haet lippuja n. 5-10 sekuntia ennen lipunmyynnin
				alkua. En tiedä antaako Kide bännejä suuresta määrästä pyyntöjä, mutta
				ei kannata lähteä kokeilemaan! Kun olet klikannut nappia, ei sinun
				tarvitse enää tehdä mitään. Näet napin alla kaikki onnistuneesti
				ostoskoriin lisätyt liput.
			</p>
		</div>
	)
}

export default Guide
