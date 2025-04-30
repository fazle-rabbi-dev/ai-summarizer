import { GoogleGenerativeAI } from "@google/generative-ai";

const savedApiKeys = localStorage.getItem("apikeys");
let GEMINI_API_KEY = "";
if (savedApiKeys) {
	GEMINI_API_KEY = JSON.parse(savedApiKeys)?.geminiKey;
}

export async function getSummaryFromGemini(prompt) {
	if (!GEMINI_API_KEY)
		throw new Error("Missing gemini api key.");
	const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

	const model = genAI.getGenerativeModel({
		model: "gemini-2.5-flash-preview-04-17",
	});
	const result = await model.generateContent(prompt);
	const response = await result.response;
	return response.text();
}
