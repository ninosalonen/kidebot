import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import './App.css'

function App() {
	const [greetMsg, setGreetMsg] = useState('')
	const name = 'Nino'

	async function greet() {
		setGreetMsg(await invoke('greet', { name }))
	}

	return (
		<div className="container">
			<h1>Welcome to Kidebot!</h1>

			<div>
				<button type="button" onClick={() => greet()}>
					Greet
				</button>
			</div>
			<p>{greetMsg}</p>
		</div>
	)
}

export default App
