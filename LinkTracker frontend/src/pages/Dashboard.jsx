import { useEffect, useState } from "react";
import { getLinks, createLink } from "../services/api.js";

const baseUrl = "http://localhost:5000";

export default function Dashboard() {

	const [links, setLinks] = useState([]);
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(true);

	//fetch all user links
	const fetchLinks = async () => {
		try {
			setLoading(true);
			const data = await getLinks();
			setLinks(data.data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	//create a link for user
	const handleCreate = async () => {
		try {
			if (!url.startsWith("http")) {
				alert("Enter valid URL");
				return;
			}

			await createLink(url);

			setUrl("");        // clear input
			fetchLinks();      // 🔥 refresh list
		} catch (err) {
			console.error(err);
			alert(err.message);
		}
	};

	useEffect(() => {
		fetchLinks();
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 py-10 px-4">
			<div className="max-w-3xl mx-auto">
				<h1 className="text-3xl font-bold mb-8 text-gray-800">
					Your Links
				</h1>
				<div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex gap-2">
					<input
						type="text"
						placeholder="Paste your URL here..."
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>

					<button
						onClick={handleCreate}
						className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition font-medium"
					>
						Create
					</button>
				</div>
				<div className="space-y-4">
					{loading ? (
						<p className="text-gray-500">Loading...</p>
					) : links.length === 0 ? (
						<div className="text-center text-gray-500 mt-10">
							No links yet. Create one above 🚀
						</div>
					) : (
						<div className="space-y-4">
							{links.map((link) => (
								<div
									key={link._id}
									className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center"
								>
									<div>
										<p className="font-semibold text-blue-600">
											{link.shortCode}
										</p>

										<p className="text-gray-600 text-sm break-all">
											{link.originalUrl}
										</p>
									</div>

									<button
										onClick={() => {
											navigator.clipboard.writeText(
												`http://localhost:3000/${link.shortCode}`
											);
										}}
										className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
									>
										Copy
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
		// <div>
		// 	<h2>Dashboard</h2>
		// 	<div className="flex gap-2 mb-6">
		// 		<input
		// 			type="text"
		// 			placeholder="Enter URL"
		// 			value={url}
		// 			onChange={(e) => setUrl(e.target.value)}
		// 			className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
		// 		/>

		// 		<button
		// 			onClick={handleCreate}
		// 			className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
		// 		>
		// 			Create
		// 		</button>
		// 	</div>
		// 	{links.length === 0 ? (
		// 		<p className="text-gray-500">No links yet</p>
		// 	) : (
		// 		<div className="space-y-4">
		// 			{links.map((link) => (
		// 				<div
		// 					key={link._id}
		// 					className="bg-white p-4 rounded-lg shadow-sm border"
		// 				>
		// 					<p className="font-semibold text-blue-600">
		// 						{link.shortCode}
		// 					</p>

		// 					<p className="text-gray-600 break-all text-sm">
		// 						{link.originalUrl}
		// 					</p>

		// 					<button
		// 						onClick={() => {
		// 							navigator.clipboard.writeText(
		// 								`http://localhost:3000/${link.shortCode}`
		// 							);
		// 						}}
		// 						className="mt-2 text-sm text-blue-500 hover:underline"
		// 					>
		// 						Copy Link
		// 					</button>
		// 				</div>
		// 			))}
		// 		</div>
		// 	)}
		// </div>
	);
}