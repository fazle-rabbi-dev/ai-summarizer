import { useState, useEffect } from "react";

import { getYouTubeVideoId } from "../utils/index.js";
import { copyToClipboard, getSummaryFromGemini } from "../utils";
import useSummarizer from "../hooks/useSummarizer.js";
import useSpeech from "../hooks/useSpeech.js";
import SummaryDisplay from "./SummaryDisplay.jsx";
import Controlls from "./Controlls.jsx";

const Summarizer = () => {
	const {
		input,
		setInput,
		summary,
		summaryType,
		setSummaryType,
		loading,
		error,
		thumbnailUrl,
		generateSummary,
	} = useSummarizer();
	const { isSpeaking, speechSpeed, setSpeechSpeed, handleSpeak } = useSpeech();

	return (
		<section className="max-w-2xl mx-auto p-4">
			<div className="my-3">
				<label
					className="block mb-2"
					for="summarizer">
					Select the type of summarizer
				</label>
				<select
					className="w-full rounded py-2 outline-0"
					id="summarizer"
					name="summarizer"
					onChange={(ev) => setSummaryType(ev.target.value)}>
					<option
						selected
						value="ytvideo">
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
					onChange={(e) => setInput(e.target.value)}></textarea>
				<button
					onClick={generateSummary}
					className="w-full bg-sky-600 mt-4 px-4 py-2 bg-blue-600 text-white rounded">
					{loading ? "Summarizing...⏳" : "Summarize 🎉"}
				</button>
			</div>

			<div className="overflow-auto prose mt-4 bg-gray-100 p-4 rounded">
				{summary && (
					<>
						<button
							onClick={handleSpeak}
							className="mb-4 px-4 py-2 bg-green-600 text-white rounded">
							{isSpeaking ? "Reading..." : "🔊 Read Summary"}
						</button>

						<Controlls />
					</>
				)}
				<SummaryDisplay
					loading={loading}
					error={error}
					thumbnailUrl={thumbnailUrl}
					summaryType={summaryType}
					summary={summary}
				/>
			</div>
		</section>
	);
};

export default Summarizer;
