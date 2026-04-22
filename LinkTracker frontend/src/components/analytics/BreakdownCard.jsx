export default function BreakdownCard({ deviceAnalytics, referrerAnalytics }) {
	if ((!deviceAnalytics || deviceAnalytics.length === 0) && (!referrerAnalytics || referrerAnalytics.length === 0)) {
		return (
			<div className="bg-white rounded-xl border border-gray-200 p-5">
				<p className="text-sm text-gray-500">Traffic Breakdown</p>
				<p className="text-gray-600 mt-2">No data available</p>
			</div>
		);
	}

	const deviceTotal = deviceAnalytics?.reduce((sum, d) => sum + d.count, 0) || 0;
	const referrerTotal = referrerAnalytics?.reduce((sum, r) => sum + r.count, 0) || 0;

	const colors = [
		"bg-blue-600",
		"bg-green-600",
		"bg-purple-600",
		"bg-orange-600",
		"bg-red-600",
	];

	return (
		<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
			{/* Devices */}
			{deviceAnalytics && deviceAnalytics.length > 0 && (
				<div className="p-5">
					<p className="text-sm text-gray-500 font-semibold mb-4">By Device</p>
					<div className="space-y-3">
						{deviceAnalytics.map((device) => {
							const percentage = deviceTotal > 0 ? ((device.count / deviceTotal) * 100).toFixed(1) : 0;
							return (
								<div key={device.device}>
									<div className="flex justify-between items-center mb-1">
										<span className="text-sm font-medium text-gray-700 capitalize">
											{device.device}
										</span>
										<span className="text-xs font-semibold text-gray-600">
											{device.count} ({percentage}%)
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className="bg-blue-600 h-2 rounded-full transition-all duration-300"
											style={{ width: `${percentage}%` }}
										></div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* Divider */}
			{deviceAnalytics?.length > 0 && referrerAnalytics?.length > 0 && (
				<div className="h-px bg-gray-200"></div>
			)}

			{/* Referrers */}
			{referrerAnalytics && referrerAnalytics.length > 0 && (
				<div className="p-5">
					<p className="text-sm text-gray-500 font-semibold mb-4">By Referrer</p>
					<div className="space-y-3">
						{referrerAnalytics.map((referrer, idx) => {
							const percentage = referrerTotal > 0 ? ((referrer.count / referrerTotal) * 100).toFixed(1) : 0;
							const colorClass = colors[idx % colors.length];
							return (
								<div key={referrer.referrer}>
									<div className="flex justify-between items-center mb-1">
										<div className="flex items-center gap-2">
											<div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
											<span className="text-sm font-medium text-gray-700 truncate max-w-xs">
												{referrer.referrer === "direct" ? "Direct" : referrer.referrer}
											</span>
										</div>
										<span className="text-xs font-semibold text-gray-600">
											{referrer.count} ({percentage}%)
										</span>
									</div>
									<div className="w-full bg-gray-200 rounded-full h-2">
										<div
											className={`${colorClass} h-2 rounded-full transition-all duration-300`}
											style={{ width: `${percentage}%` }}
										></div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
