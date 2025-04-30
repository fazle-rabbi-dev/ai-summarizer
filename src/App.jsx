import Summarizer from "./components/Summerizer.jsx";
import Settings from "./components/Settings.jsx";
import "./globals.css";

function App() {
	return (
		<main className="min-h-screen bg-white text-gray-900">
			<h1 className="text-center text-3xl font-bold mt-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-rose-600">
				✨ Ai Summarizer
			</h1>
			<Settings />
			<Summarizer />
		</main>
	);
}

export default App;
