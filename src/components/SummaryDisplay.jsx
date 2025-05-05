import ReactMarkdown from "react-markdown";

export default function SummaryDisplay({ loading, error, thumbnailUrl, summaryType, summary }) {
	if (loading) {
		return <p>⏳ Wait a moment, summary will be appear here...</p>;
	}

	if (error) {
		return <p className="text-rose-600">❌ Something went wrong: {error.message}</p>;
	}

	return (
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
	);
}
