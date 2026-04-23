export default function CreateLinkForm({
	url,
	name,
	creating,
	onUrlChange,
	onNameChange,
	onCreate,
}) {
	return (
		<div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
			<div className="flex gap-2 mb-3">
				<input
					type="text"
					placeholder="Paste your URL here..."
					value={url}
					onChange={(e) => onUrlChange(e.target.value)}
					className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
			<div className="flex flex-col sm:flex-row gap-2">
				<input
					type="text"
					placeholder="Link name (optional)"
					value={name}
					onChange={(e) => onNameChange(e.target.value)}
					className="flex-1 min-w-0 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>

				<button
					onClick={onCreate}
					disabled={creating}
					className="w-full sm:w-auto bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed"
				>
					{creating ? "Creating..." : "Create"}
				</button>
			</div>
		</div>
	);
}
