export const getYouTubeVideoId = url => {
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
    alert(summary)
    await navigator.clipboard.writeText(summary);
    console.log("Text copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy!", err);
  }
};
