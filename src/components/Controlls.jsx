import { copyToClipboard } from "../utils";

const Controlls = ({ speechSpeed, setSpeechSpeed, summary }) => {
	return (
		<div className="">
			<div className="my-4">
				<label
					htmlFor="speedControl"
					className="block mb-2">
					Adjust Speed
				</label>
				<input
					type="range"
					id="speedControl"
					min="0.5"
					max="2"
					step="0.1"
					value={speechSpeed}
					onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
					className="w-full"
				/>
				<p>Speed: {speechSpeed}x</p>
			</div>

			<div className="flex flex-wrap gap-3 mt-2">
				<button
					onClick={() => window.speechSynthesis.pause()}
					className="px-3 py-1 bg-yellow-500 text-white rounded">
					⏸ Pause
				</button>
				<button
					onClick={() => window.speechSynthesis.resume()}
					className="px-3 py-1 bg-blue-500 text-white rounded">
					▶️ Resume
				</button>
				<button
					onClick={() => {
						window.speechSynthesis.cancel();
						setIsSpeaking(false); // reset button label
					}}
					className="px-3 py-1 bg-red-600 text-white rounded">
					⏹ Cancel
				</button>
				<button
					onClick={() => copyToClipboard(summary)}
					className="w-full bg-black/70 text-white rounded-md py-2"
					type="button">
					Copy to clipboard
				</button>
			</div>
		</div>
	);
};

export default Controlls;
