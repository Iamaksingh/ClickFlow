import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLinks, createLink, logoutUser } from "../services/api.js";

const baseUrl = "http://localhost:5000";

export default function Dashboard() {

	const [links, setLinks] = useState([]);
	const [url, setUrl] = useState("");
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

	//fetch all user links
	const fetchLinks = async () => {
		try {
			setLoading(true);
			const data = await getLinks();
			setLinks(data.data);
			setIsAuthenticated(true);
		} catch (err) {
			console.error(err);
			setIsAuthenticated(false);
			setLinks([]);
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

	const handleLogout = async () => {
		try {
			await logoutUser();
			setIsAuthenticated(false);
			setLinks([]);
		} catch (err) {
			console.error(err);
			alert(err.message || "Unable to logout");
		}
	};

	if (!loading && !isAuthenticated) {
		return (
			<div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
				<div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
					<h1 className="text-3xl font-bold text-gray-900 mb-3">Link Tracker</h1>
					<p className="text-gray-600 mb-6">
						You are logged out. Please login to create and manage your links.
					</p>
					<Link
						to="/login"
						className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
					>
						Login
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 py-10 px-4">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-bold text-gray-800">Your Links</h1>
					<button
						onClick={handleLogout}
						className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
					>
						Logout
					</button>
				</div>
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
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{links.map((link) => {
								const shortUrl = `${baseUrl}/${link.shortCode}`;

								return (
									<div
										key={link._id}
										className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 hover:bg-blue-50/30 transition-all duration-300 ease-out flex flex-col min-h-[220px]"
									>
										<div className="flex h-full flex-col justify-between gap-4">
											<div className="space-y-2 min-w-0">
												<p className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide">
													/{link.shortCode}
												</p>

												<p className="text-gray-700 text-sm break-all leading-relaxed">
													{link.originalUrl}
												</p>

												<a
													href={shortUrl}
													target="_blank"
													rel="noreferrer"
													className="inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline break-all"
												>
													{shortUrl}
												</a>
											</div>

											<div className="flex flex-wrap gap-2">
												<button
													onClick={() => {
														navigator.clipboard.writeText(shortUrl);
													}}
													className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer"
												>
													Copy Link
												</button>

												<button
													onClick={() => navigate(`/links/${link._id}/analytics`)}
													className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
												>
													Analytics
												</button>
											</div>
										</div>
									</div>
								);
							})}
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