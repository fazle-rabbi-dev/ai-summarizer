import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getSummaryFromGemini(prompt) {
	const savedApiKeys = localStorage.getItem("apikeys");
	let GEMINI_API_KEY = "";
	if (savedApiKeys) {
		GEMINI_API_KEY = JSON.parse(savedApiKeys)?.geminiKey;
	}

	if (!GEMINI_API_KEY) throw new Error("Missing gemini api key.");
	const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

	const model = genAI.getGenerativeModel({
		model: "gemini-2.5-flash",
	});
	const result = await model.generateContent(prompt);
	const response = await result.response;
	return response.text();
}
