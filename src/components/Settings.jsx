import { useState, useEffect } from "react";
import { Settings } from "lucide-react";

const SettingsSection = () => {
	const [displayPopup, setDisplayPopup] = useState(false);

	return (
		<section className="max-w-2xl mx-auto px-4">
			<p className="flex items-center justify-end">
				<Settings
					onClick={() =>
						setDisplayPopup(curValue => !curValue)
					}
				/>
			</p>
			{displayPopup && (
				<Popup setDisplayPopup={setDisplayPopup} />
			)}
		</section>
	);
};

const Popup = ({ setDisplayPopup }) => {
	const [rapidKey, setRapidKey] = useState("");
	const [geminiKey, setGeminiKey] = useState("");
	const [currentApiKeys, setCurrentApiKeys] = useState({});

	useEffect(() => {
		const savedApiKeys = localStorage.getItem("apikeys");
		if (savedApiKeys) {
			const currentApiKeys = JSON.parse(savedApiKeys);
			setCurrentApiKeys(currentApiKeys);
		}
	}, []);

	const handleSaveApiKey = () => {
		if (!rapidKey?.trim() || !geminiKey?.trim()) {
			return alert("Enter valid api key.");
		}

		localStorage.setItem(
			"apikeys",
			JSON.stringify({
				rapidKey,
				geminiKey,
			}),
		);

		setCurrentApiKeys({
			rapidKey,
			geminiKey,
		});
		alert("Saved successfully.");
	};

	const handlePoupOutsideClick = e => {
		const popupBox = document.getElementById("popupBox");
		if (!popupBox.contains(e.target)) {
			setDisplayPopup(false);
		}
	};

	return (
		<div
			onClick={handlePoupOutsideClick}
			className="fixed inset-0 bg-black/70 p-4"
		>
			<div
				id="popupBox"
				className="p-4 bg-gray-100 shadow rounded"
			>
				<div className="">
					<label>Enter rapid api key</label>
					<input
						className="w-full p-1 border-[1px] border-white outline-0 rounded"
						type="text"
						value={rapidKey}
						onChange={e => setRapidKey(e.target.value)}
					/>
				</div>
				<div className="">
					<label>Enter gemini api key</label>
					<input
						className="w-full p-1 border-[1px] border-white outline-0 rounded"
						type="text"
						value={geminiKey}
						onChange={e => setGeminiKey(e.target.value)}
					/>
				</div>
				<button
					onClick={handleSaveApiKey}
					type="button"
					className="w-full mt-2 p-2 bg-sky-600 text-white rounded"
				>
					Save
				</button>

				{currentApiKeys && (
					<div className="w-full overflow-auto">
						<h2 className="text-xl my-2 ">
							Currently saved api keys
						</h2>
						<p>Rapid api key: {currentApiKeys?.rapidKey}</p>
						<p>
							Gemini api key: {currentApiKeys?.geminiKey}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default SettingsSection;
