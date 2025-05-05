import { useState } from "react";

export default function useSummarizer() {
	const [input, setInput] = useState("");
	const [summaryType, setSummaryType] = useState("ytvideo");
	const [summary, setSummary] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [thumbnailUrl, setThumbnailUrl] = useState("");

	const generateSummary = async () => {
		if (!input?.trim()) return alert("Please paste video/article url.");
		if (!summaryType) return alert("Summary type is invalid.");

		setLoading(true);
		let prompt = `You are an AI summarizer. Summarize the following article in bullet points with markdown format: \n\n${input}`;

		try {
			if (summaryType == "ytvideo") {
				console.log(`Youtube video summarizing started for the video: ${input}`);

				const videoId = getYouTubeVideoId(input);
				if (!videoId) {
					return alert("Oops! enter correct video url.");
				}

				const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
				setThumbnailUrl(thumbnailUrl);

				// ╭────────────────────────────────────────────────────────╮
				// │      Generate Video Transcript
				// ╰────────────────────────────────────────────────────────╯

				let savedApiKeys = localStorage.getItem("apikeys");
				if (!savedApiKeys) throw new Error("Failed to get saved api keys.");
				savedApiKeys = JSON.parse(savedApiKeys);
				let transcript = "";

				if (savedApiKeys.transcriptApiVariant === "rapidApi") {
					console.log("Using rapid api to generate transcript...");

					const videoId = getYouTubeVideoId(input);
					if (!videoId) alert("Oops! enter correct video url.");
					setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);

					// Fetch rapid api key
					const RAPID_API_KEY = savedApiKeys.rapidKey;

					if (!RAPID_API_KEY) throw new Error("Missing rapid api api key.");

					const options = {
						method: "GET",
						headers: {
							"X-RapidAPI-Key": RAPID_API_KEY,
							"X-RapidAPI-Host": "youtube-transcript3.p.rapidapi.com",
						},
					};

					const res = await fetch(
						`https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${videoId}`,
						options
					);
					const textData = await res.text();
					const jsonData = JSON.parse(textData);
					transcript = jsonData?.transcript?.map((item) => item.text).join(" ");
					if (!transcript)
						throw new Error(
							"Failed to generate transcript using rapid api. Set correct api key from settings."
						);
				} else {
					console.log("Using custom api to generate transcript...");

					const res = await fetch(
						`${import.meta.env.VITE_TRANSCRIPT_API_URL}?videoId=${videoId}`
					);
					const result = await res.json();
					transcript = result.transcript;

					if (!transcript) throw new Error("The video doesn't have captions.");
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

	return {
		input,
		setInput,
		summary,
		summaryType,
		setSummaryType,
		loading,
		error,
		thumbnailUrl,
		generateSummary,
	};
}
