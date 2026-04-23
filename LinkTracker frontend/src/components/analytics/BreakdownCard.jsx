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

	const hasDevices = deviceAnalytics && deviceAnalytics.length > 0;
	const hasReferrers = referrerAnalytics && referrerAnalytics.length > 0;
	const sideBySide = hasDevices && hasReferrers;

	return (
		<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
			<div
				className={
					sideBySide
						? "grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-12 md:gap-y-0"
						: "flex flex-col gap-8"
				}
			>
				{hasDevices && (
					<div className="min-w-0 p-5">
						<p className="text-sm text-gray-500 font-semibold mb-4">By Device</p>
						<div className="space-y-3">
							{deviceAnalytics.map((device) => {
								const percentage = deviceTotal > 0 ? ((device.count / deviceTotal) * 100).toFixed(1) : 0;
								return (
									<div key={device.device}>
										<div className="flex justify-between items-center gap-2 mb-1">
											<span className="text-sm font-medium text-gray-700 capitalize truncate min-w-0">
												{device.device}
											</span>
											<span className="shrink-0 text-xs font-semibold text-gray-600">
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

				{hasReferrers && (
					<div className="min-w-0 p-5">
						<p className="text-sm text-gray-500 font-semibold mb-4">By Referrer</p>
						<div className="space-y-3">
							{referrerAnalytics.map((referrer, idx) => {
								const percentage = referrerTotal > 0 ? ((referrer.count / referrerTotal) * 100).toFixed(1) : 0;
								const colorClass = colors[idx % colors.length];
								return (
									<div key={referrer.referrer}>
										<div className="flex justify-between items-center gap-2 mb-1">
											<div className="flex min-w-0 items-center gap-2">
												<div className={`w-3 h-3 shrink-0 rounded-full ${colorClass}`}></div>
												<span className="text-sm font-medium text-gray-700 truncate">
													{referrer.referrer === "direct" ? "Direct" : referrer.referrer}
												</span>
											</div>
											<span className="shrink-0 text-xs font-semibold text-gray-600">
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
		</div>
	);
}
