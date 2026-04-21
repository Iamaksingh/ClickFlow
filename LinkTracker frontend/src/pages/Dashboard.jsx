import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLinks, createLink, logoutUser, deleteLink } from "../services/api.js";
import { useToast } from "../components/ToastProvider.jsx";

const baseUrl = "http://localhost:5000";

export default function Dashboard() {

	const [links, setLinks] = useState([]);
	const [url, setUrl] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(true);
	const [creating, setCreating] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();
	const { showToast } = useToast();

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
				showToast("Enter valid URL", "error");
				return;
			}
			setCreating(true);
			await createLink(url, name || null);
			showToast("Link created successfully", "success");

			setUrl("");        // clear input
			setName("");       // clear name input
			await fetchLinks();      // refresh list
		} catch (err) {
			console.error(err);
			showToast(err.message || "Unable to create link", "error");
		} finally {
			setCreating(false);
		}
	};

	//delete a link
	const handleDelete = async (linkId) => {
		if (!window.confirm("Are you sure you want to delete this link?")) {
			return;
		}

		try {
			await deleteLink(linkId);
			showToast("Link deleted successfully", "success");
			setLinks(links.filter(link => link._id !== linkId));
		} catch (err) {
			console.error(err);
			showToast(err.message || "Unable to delete link", "error");
		}
	};
	
	//logout user function
	const handleLogout = async () => {
		try {
			await logoutUser();
			setIsAuthenticated(false);
			setLinks([]);
		} catch (err) {
			console.error(err);
			showToast(err.message || "Unable to logout", "error");
		}
	};

	useEffect(() => {
		fetchLinks();
	}, []);


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
				<div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
					<div className="flex gap-2 mb-3">
						<input
							type="text"
							placeholder="Paste your URL here..."
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
					<div className="flex gap-2">
						<input
							type="text"
							placeholder="Link name (optional)"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>

						<button
							onClick={handleCreate}
							disabled={creating}
							className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{creating ? "Creating..." : "Create"}
						</button>
					</div>
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
								const truncatedUrl = link.originalUrl.length > 45 
									? link.originalUrl.substring(0, 45) + '...' 
									: link.originalUrl;

								return (
									<div
										key={link._id}
										className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col"
									>
										
										{/* Name Section */}
										{link.name && ( <div className="mb-4">
											<div className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-400 bg-gray-50 px-3 py-1.5 shadow-sm">
												<span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
													Link Name
												</span>
												<span className="font-mono text-sm font-semibold text-gray-900">
													"{link.name.toUpperCase()}"
												</span>
											</div>
										</div>)}

										{/* Shortcode Section */}
										<div className="mb-4">
											<div className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-400 bg-gray-50 px-3 py-1.5 shadow-sm">
												<span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
													Shortcode
												</span>
												<span className="font-mono text-sm font-semibold text-gray-900">
													"{link.shortCode}"
												</span>
											</div>
										</div>

										{/* URL Section */}
										<div className="flex-1 min-h-0 mb-4">
											<p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
												Original URL
											</p>
											<div className="flex items-start gap-2">
												<a
													href={link.originalUrl}
													target="_blank"
													rel="noreferrer"
													title={link.originalUrl}
													data-tooltip={link.originalUrl}
													className="text-sm text-blue-600 hover:text-blue-700 break-words flex-1 line-clamp-2 tooltip-link"
												>
													{truncatedUrl}
												</a>
												<a
													href={link.originalUrl}
													target="_blank"
													rel="noreferrer"
													title="Open original URL"
													aria-label={`Open original URL ${link.originalUrl}`}
													className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition mt-0.5"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth={2}
														stroke="currentColor"
														className="w-4 h-4"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M13.5 6H18m0 0v4.5M18 6 10.5 13.5M7.5 6h3m-3 0A1.5 1.5 0 0 0 6 7.5v9A1.5 1.5 0 0 0 7.5 18h9a1.5 1.5 0 0 0 1.5-1.5v-3"
														/>
													</svg>
												</a>
											</div>
										</div>

										{/* Actions */}
										<div className="flex gap-2 pt-4 border-t border-gray-100">
											<button
												onClick={async () => {
													try {
														await navigator.clipboard.writeText(shortUrl);
														showToast("Link copied to clipboard", "success");
													} catch (err) {
														console.error(err);
														showToast("Unable to copy link", "error");
													}
												}}
												className="flex-1 text-sm font-medium text-gray-700 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition cursor-pointer"
											>
												Copy Link
											</button>

											<button
												onClick={() => navigate(`/links/${link._id}/analytics`)}
												className="flex-1 text-sm font-medium bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
											>
												Analytics
											</button>

											<button
												onClick={() => handleDelete(link._id)}
												className="text-sm font-medium text-red-600 px-3 py-2 rounded-lg border border-red-300 hover:bg-red-50 transition cursor-pointer"
												title="Delete this link"
											>
												🗑️
											</button>
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