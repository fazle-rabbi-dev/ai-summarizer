import { useState } from "react";
import { getSummaryFromGemini } from "../utils/gemini";
import ReactMarkdown from "react-markdown";
import { YoutubeTranscript } from "youtube-transcript";
import { getYouTubeVideoId } from "../utils/index.js";

const Summarizer = () => {
	const [input, setInput] = useState("");
	const [summaryType, setSummaryType] = useState("ytvideo");
	const [summary, setSummary] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [thumbnailUrl, setThumbnailUrl] = useState("");

	const handleSummaryTypeChange = e => {
		setSummaryType(e.target.value);
	};

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

				// ╭────────────────────────────────────────────────────────╮
				// │      Get Video Transcript
				// ╰────────────────────────────────────────────────────────╯
				const videoId = getYouTubeVideoId(input);
				if (!videoId)
					alert("Oops! enter correct video url.");

				// Fetch video thumbnail
				const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
				setThumbnailUrl(thumbnailUrl);

				// Fetch rapid api key
				const savedApiKeys =
					localStorage.getItem("apikeys");
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
				const transcript = jsFormatData?.transcript
					?.map(item => item.text)
					.join(" ");
				if (!transcript)
					throw new Error(
						"Failed to generate transcript. Set correct api key from settings.",
					);
				console.log({ transcript });

				prompt = `You are an AI summarizer. Summarize the following YouTube video transcript in bullet points and in markdown format:\n\n${transcript}`;
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
					onChange={handleSummaryTypeChange}
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
