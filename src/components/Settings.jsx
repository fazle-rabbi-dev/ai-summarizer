import { useState, useEffect } from "react";
import { Settings } from "lucide-react";

const SettingsSection = () => {
	const [displayPopup, setDisplayPopup] = useState(false);
  
  useEffect(() => {
		const savedApiKeys = localStorage.getItem("apikeys");
		let currentApiKeys = JSON.parse(savedApiKeys);
		if(!currentApiKeys || typeof currentApiKeys !== "object") {
		  currentApiKeys = {}
		}
		
		localStorage.setItem(
			"apikeys",
			JSON.stringify({
				...currentApiKeys,
				transcriptApiVariant:
					currentApiKeys?.transcriptApiVariant || "rapidKey",
			}),
		);
	}, []);
  
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
	const [transcriptApiUrl, setTranscriptApiUrl] =
		useState("");
	const [transcriptApiVariant, setTranscriptApiVariant] =
		useState("");

	useEffect(() => {
		const savedApiKeys = localStorage.getItem("apikeys");
		const currentApiKeys = JSON.parse(savedApiKeys);
		if (currentApiKeys) {
			setCurrentApiKeys(currentApiKeys);
			setTranscriptApiVariant(
				currentApiKeys.transcriptApiVariant || "rapidKey",
			);
		}
	}, []);

	const handleSaveApiKey = () => {
		/*if (!rapidKey?.trim() || !geminiKey?.trim() || !transcriptApiUrl?.trim()) {
			return alert("Enter valid api key.");
		}*/

		const newData = {};
		if (rapidKey.trim()) {
			newData.rapidKey = rapidKey;
		}
		if (geminiKey.trim()) {
			newData.geminiKey = geminiKey;
		}
		if (transcriptApiUrl.trim()) {
			newData.transcriptApiUrl = transcriptApiUrl;
		}

		const savedData = localStorage.getItem("apikeys");

		console.log({ newData });

		localStorage.setItem(
			"apikeys",
			JSON.stringify({
				...JSON.parse(savedData),
				...newData,
			}),
		);

		setCurrentApiKeys({
			rapidKey,
			geminiKey,
			transcriptApiUrl,
		});
		alert("Saved successfully.");
	};

	const handlePoupOutsideClick = e => {
		const popupBox = document.getElementById("popupBox");
		if (!popupBox.contains(e.target)) {
			setDisplayPopup(false);
		}
	};

	const toggleTranscriptApiVariant = ev => {
		try {
			const savedApiData = localStorage.getItem("apikeys");
			console.log(JSON.parse(savedApiData));

			localStorage.setItem(
				"apikeys",
				JSON.stringify({
					...JSON.parse(savedApiData),
					transcriptApiVariant:
						transcriptApiVariant === "rapidApi"
							? "customApi"
							: "rapidApi",
				}),
			);
			console.log(
				`Should change to:`,
				transcriptApiVariant === "rapidApi"
					? "customApi"
					: "rapidApi",
			);
			setCurrentApiKeys(currKeys => ({
				...currKeys,
				transcriptApiVariant:
					transcriptApiVariant === "rapidApi"
						? "customApi"
						: "rapidApi",
			}));
		} catch (error) {
			console.log(error);
		}
		setTranscriptApiVariant(currVariant =>
			currVariant === "rapidApi" ? "customApi" : "rapidApi",
		);
	};

	return (
		<div
			onClick={handlePoupOutsideClick}
			className="fixed inset-0 bg-black/70 p-4"
		>
			<div
				id="popupBox"
				className="w-[60%] max-w-2xl p-4 bg-gray-100 shadow rounded mx-auto"
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
				<div className="">
					<label>Enter transcript api url</label>
					<input
						className="w-full p-1 border-[1px] border-white outline-0 rounded"
						type="text"
						value={transcriptApiUrl}
						onChange={e =>
							setTranscriptApiUrl(e.target.value)
						}
					/>
				</div>
				<button
					onClick={handleSaveApiKey}
					type="button"
					className="w-full mt-2 p-2 bg-sky-600 text-white rounded"
				>
					Save
				</button>

				<div className="my-2 flex items-center gap-4 text-sky-700">
					<label htmlFor="usecustomapi">
						Use custom api instead rapid api
					</label>
					<input
						onChange={toggleTranscriptApiVariant}
						id="usecustomapi"
						type="checkbox"
						name=""
						checked={
							currentApiKeys?.transcriptApiVariant ===
							"customApi"
						}
					/>
				</div>

				{currentApiKeys && (
					<div className="w-full overflow-auto">
						<h2 className="text-xl my-2 ">
							Currently saved api keys
						</h2>
						<p>
							<span className="font-bold">
								Rapid api key:
							</span>{" "}
							{currentApiKeys?.rapidKey}
						</p>
						<p>
							<span className="font-bold">
								Gemini api key:
							</span>{" "}
							{currentApiKeys?.geminiKey}
						</p>
						<p>
							<span className="font-bold">
								Custom transcript api url:
							</span>{" "}
							{currentApiKeys?.transcriptApiUrl}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default SettingsSection;
