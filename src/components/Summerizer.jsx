import { useState, useEffect } from "react";
import { getSummaryFromGemini } from "../utils/gemini";
import ReactMarkdown from "react-markdown";
import { YoutubeTranscript } from "youtube-transcript";
import { getYouTubeVideoId } from "../utils/index.js";
import { copyToClipboard } from "../utils"

const Summarizer = () => {
	const [input, setInput] = useState("");
	const [summaryType, setSummaryType] = useState("ytvideo");
	const [summary, setSummary] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [thumbnailUrl, setThumbnailUrl] = useState("");

	const [isSpeaking, setIsSpeaking] = useState(false);
	const [voices, setVoices] = useState([]);
	const [selectedVoice, setSelectedVoice] = useState(null);
	const [speechSpeed, setSpeechSpeed] = useState(1); // Default speed: 1

	useEffect(() => {
		const voices = window.speechSynthesis.getVoices();
		setVoices(voices);
		setSelectedVoice(voices[0]); // Set the default voice (first one)
	}, []);

	
  
	const handleSummarize = async () => {
		if (!input?.trim())
			return alert("Please paste video/article url.");
		if (!summaryType)
			return alert("Summary type is invalid.");

		setLoading(true);
		let prompt = `You are an AI summarizer. Summarize the following article in bullet points and in markdown format: \n\n${input}`;

		try {
			if (summaryType == "ytvideo") {
				console.log(
					`Summarizing started for the video: ${input}`,
				);

				const videoId = getYouTubeVideoId(input);
				if (!videoId) {
					return alert("Oops! enter correct video url.");
				}

				const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
				console.log({ thumbnailUrl });
				setThumbnailUrl(thumbnailUrl);

				// ╭────────────────────────────────────────────────────────╮
				// │      Get Video Transcript
				// ╰────────────────────────────────────────────────────────╯

				const savedApiKeys =
					localStorage.getItem("apikeys");
				let transcript = "";
				if (
					JSON.parse(savedApiKeys)?.transcriptApiVariant === "rapidApi"
				) {
					console.log(
						"Using rapid api to generate transcript...",
					);

					const videoId = getYouTubeVideoId(input);
					if (!videoId)
						alert("Oops! enter correct video url.");

					// Fetch video thumbnail
					const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
					setThumbnailUrl(thumbnailUrl);

					// Fetch rapid api key
					const RAPID_API_KEY =
						JSON.parse(savedApiKeys)?.rapidKey;

					if (!RAPID_API_KEY)
						throw new Error("Missing rapid api api key.");

					const options = {
						method: "GET",
						headers: {
							"X-RapidAPI-Key": RAPID_API_KEY,
							"X-RapidAPI-Host":
								"youtube-transcript3.p.rapidapi.com",
						},
					};

					const res = await fetch(
						`https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${videoId}`,
						options,
					);
					const textData = await res.text();
					const jsFormatData = JSON.parse(textData);
					transcript = jsFormatData?.transcript
						?.map(item => item.text)
						.join(" ");
					if (!transcript)
						throw new Error(
							"Failed to generate transcript. Set correct api key from settings.",
						);
				} else {
					console.log('Using custom api to generate transcript...')
					const res = await fetch(
						`${
							import.meta.env.VITE_TRANSCRIPT_API_URL
						}?videoId=${videoId}`,
					);
					const result = await res.json();
					transcript = result.transcript;
					if (!transcript)
						throw new Error(
							"The video doesn't have captions.",
						);
					console.log({ transcript });
				}
				prompt = `You are an AI summarizer. Summarize the following YouTube video transcript in bullet points and in markdown format, at the top of summary write a custom ai generated video title with an emoji, also the full summary represent with relevant emoji for better readability (do not overuse emoji) and always generate summary in english and at last always write a TL;DR section:\n\n${transcript}`;
			}

			// ╭────────────────────────────────────────────────────────╮
			// │      Generate summary
			// ╰────────────────────────────────────────────────────────╯
			const result = await getSummaryFromGemini(prompt);
			setSummary(result);
			setLoading(false);
			setError(null);
		} catch (error) {
			console.log(`#Erroe occured. Details: ${error}`);
			setLoading(false);
			setError(error);
		}
	};

	const handleSpeak = () => {
		if (!summary) return;

		if (isSpeaking) {
			setIsSpeaking(false);
			window.speechSynthesis.cancel();
		}

		const utterance = new SpeechSynthesisUtterance(summary);
		utterance.lang = "en-US";
		utterance.rate = speechSpeed;
		utterance.voice = selectedVoice;

		utterance.onstart = () => setIsSpeaking(true);
		utterance.onerror = () => setIsSpeaking(false);

		utterance.onend = () => {
			setIsSpeaking(false);
		};

		window.speechSynthesis.cancel(); // Cancel any previous speech
		window.speechSynthesis.speak(utterance);
	};

	return (
		<section className="max-w-2xl mx-auto p-4">
			<div className="my-3">
				<label
					className="block mb-2"
					for="summarizer"
				>
					Select the type of summarizer
				</label>
				<select
					className="w-full rounded py-2 outline-0"
					id="summarizer"
					name="summarizer"
					onChange={(ev) => setSummaryType(ev.target.value)}
				>
					<option
						selected
						value="ytvideo"
					>
						Youtube Video
					</option>
					<option value="article">Article</option>
				</select>
			</div>

			<div className="">
				<textarea
					className="w-full p-2 border rounded"
					rows="6"
					placeholder="Paste article or YouTube video link..."
					value={input}
					onChange={e => setInput(e.target.value)}
				></textarea>
				<button
					onClick={handleSummarize}
					className="w-full bg-sky-600 mt-4 px-4 py-2 bg-blue-600 text-white rounded"
				>
					{loading ? "Summarizing...⏳" : "Summarize 🎉"}
				</button>
			</div>

			<div className="overflow-auto prose mt-4 bg-gray-100 p-4 rounded">
				{summary && (
					<>
						<button
							onClick={handleSpeak}
							className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
						>
							{isSpeaking
								? "Reading..."
								: "🔊 Read Summary"}
						</button>

						<div className="my-4">
							<label
								htmlFor="voiceSelect"
								className="block mb-2"
							>
								Select Voice
							</label>
							<select
								id="voiceSelect"
								className="w-full p-2 border rounded"
								onChange={e =>
									setSelectedVoice(
										voices.find(
											v => v.name === e.target.value,
										),
									)
								}
								value={selectedVoice?.name || ""}
							>
								{voices.map((voice, index) => (
									<option
										key={index}
										value={voice.name}
									>
										{voice.name}
									</option>
								))}
							</select>
						</div>

						<div className="my-4">
							<label
								htmlFor="speedControl"
								className="block mb-2"
							>
								Adjust Speed
							</label>
							<input
								type="range"
								id="speedControl"
								min="0.5"
								max="2"
								step="0.1"
								value={speechSpeed}
								onChange={e =>
									setSpeechSpeed(parseFloat(e.target.value))
								}
								className="w-full"
							/>
							<p>Speed: {speechSpeed}x</p>
						</div>

						<div className="flex flex-wrap gap-3 mt-2">
							<button
								onClick={() =>
									window.speechSynthesis.pause()
								}
								className="px-3 py-1 bg-yellow-500 text-white rounded"
							>
								⏸ Pause
							</button>
							<button
								onClick={() =>
									window.speechSynthesis.resume()
								}
								className="px-3 py-1 bg-blue-500 text-white rounded"
							>
								▶️ Resume
							</button>
							<button
								onClick={() => {
									window.speechSynthesis.cancel();
									setIsSpeaking(false); // reset button label
								}}
								className="px-3 py-1 bg-red-600 text-white rounded"
							>
								⏹ Cancel
							</button>
							<button onClick={copyToClipboard} className="w-full bg-black/70 text-white rounded-md py-2" type="button">
							  Copy to clipboard
							</button>
						</div>
					</>
				)}

				{loading ? (
					<p>
						⏳ Wait a moment summary will be appear here..
					</p>
				) : error ? (
					<>
						<span className="text-rose-600">
							Something went wrong due to{" "}
						</span>
						{error.message}
					</>
				) : (
					<>
						<h2 className="font-bold mb-2">🔴 Summary:</h2>
						{summaryType === "ytvideo" && thumbnailUrl && (
							<img
								className="mb-2 w-full h-auto"
								src={thumbnailUrl}
								alt="video thumbnail"
							/>
						)}
						<ReactMarkdown>{summary}</ReactMarkdown>
					</>
				)}
			</div>
		</section>
	);
};

export default Summarizer;
