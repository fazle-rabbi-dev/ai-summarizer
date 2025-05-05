export { getSummaryFromGemini } from "./gemini";

export const getYouTubeVideoId = (url) => {
	try {
		const parsedUrl = new URL(url);
		const host = parsedUrl.hostname;

		if (host.includes("youtube.com")) {
			return parsedUrl.searchParams.get("v");
		}

		if (host.includes("youtu.be")) {
			return parsedUrl.pathname.split("/")[1];
		}

		return null; // Not a valid YouTube link
	} catch (err) {
		return null; // Invalid URL format
	}
};

export const copyToClipboard = async (text) => {
	try {
		// ✅ First try modern Clipboard API
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
		} else {
			// ⛔ Fallback for insecure contexts or unsupported browsers
			const textarea = document.createElement("textarea");
			textarea.value = text;
			textarea.style.position = "fixed"; // Avoid scrolling
			textarea.style.opacity = "0";
			document.body.appendChild(textarea);
			textarea.focus();
			textarea.select();

			const successful = document.execCommand("copy");
			if (!successful) throw new Error("Fallback copy failed");

			document.body.removeChild(textarea);
		}
		console.log("✅ Text copied to clipboard!");
	} catch (err) {
		console.error("❌ Failed to copy!", err);
	}
};
