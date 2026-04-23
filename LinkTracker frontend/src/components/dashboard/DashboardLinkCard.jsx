const baseUrl = import.meta.env.BASE_URL

export default function DashboardLinkCard({
	link,
	onCopyLink,
	onOpenAnalytics,
	onDeleteLink,
}) {
	const shortUrl = `${baseUrl}/${link.shortCode}`;
	const truncatedUrl =
		link.originalUrl.length > 45
			? `${link.originalUrl.substring(0, 45)}...`
			: link.originalUrl;

	return (
		<div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col">
			{link.name && (
				<div className="mb-4">
					<div className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-400 bg-gray-50 px-3 py-1.5 shadow-sm">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
							Link Name
						</span>
						<span className="font-mono text-sm font-semibold text-gray-900">
							"{link.name.toUpperCase()}"
						</span>
					</div>
				</div>
			)}

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

			<div className="flex gap-2 pt-4 border-t border-gray-100">
				<button
					onClick={() => onCopyLink(shortUrl)}
					className="flex-1 text-sm font-medium text-gray-700 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition cursor-pointer"
				>
					Copy Link
				</button>

				<button
					onClick={() => onOpenAnalytics(link._id)}
					className="flex-1 text-sm font-medium bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
				>
					Analytics
				</button>

				<button
					onClick={() => onDeleteLink(link._id)}
					className="text-sm font-medium text-red-600 px-3 py-2 rounded-lg border border-red-300 hover:bg-red-50 transition cursor-pointer"
					title="Delete this link"
				>
					🗑️
				</button>
			</div>
		</div>
	);
}
