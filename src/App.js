


import Calculator from "./components/Calculator"
import ThemeSwitcher from "./components/ThemeSwitcher"

export default function App() {

	return (
		<div className="App">
			<Calculator />
			<div className="switcher">
				<ThemeSwitcher />
			</div>
		</div>
	)
}