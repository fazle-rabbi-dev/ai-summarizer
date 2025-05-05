import { useState, useEffect } from "react";

export default function useSpeech() {
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [speechSpeed, setSpeechSpeed] = useState(1); // Default speed: 1

	const handleSpeak = (summary) => {
		if (!summary) return;

		if (isSpeaking) {
			setIsSpeaking(false);
			window.speechSynthesis.cancel();
		}

		const utterance = new SpeechSynthesisUtterance(summary);
		utterance.lang = "en-US";
		utterance.rate = speechSpeed;
		// utterance.voice = selectedVoice;

		utterance.onstart = () => setIsSpeaking(true);
		utterance.onerror = () => setIsSpeaking(false);

		utterance.onend = () => {
			setIsSpeaking(false);
		};

		window.speechSynthesis.cancel(); // Cancel any previous speech
		window.speechSynthesis.speak(utterance);
	};

	return {
		isSpeaking,
		speechSpeed,
		setSpeechSpeed,
		handleSpeak,
	};
}
