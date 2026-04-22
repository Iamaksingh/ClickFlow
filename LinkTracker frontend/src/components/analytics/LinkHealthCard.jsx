export default function LinkHealthCard({ staleStatus, spikeDetection }) {
	if (!staleStatus || !spikeDetection) {
		return null;
	}

	const { isStale, lastClickDate, daysInactive } = staleStatus;
	const { hasSpike, todayClicks, threshold, spikePercentage } = spikeDetection;

	// Link Status (Stale or Active)
	const linkStatus = isStale
		? {
				icon: "⚠️",
				title: "Link Inactive",
				message: daysInactive ? `No clicks in ${daysInactive} days` : "No clicks recorded",
				bgColor: "bg-yellow-50",
				borderColor: "border-yellow-200",
				textColor: "text-yellow-900",
				subtextColor: "text-yellow-700",
		  }
		: {
				icon: "✓",
				title: "Link Active",
				message: `Last accessed: ${lastClickDate}`,
				bgColor: "bg-green-50",
				borderColor: "border-green-200",
				textColor: "text-green-900",
				subtextColor: "text-green-700",
		  };

	// Activity Status (Spike or Normal)
	const activityStatus = hasSpike
		? {
				icon: "🚀",
				title: "Spike Detected",
				message: `Today: ${todayClicks} clicks - ${spikePercentage > 0 ? `+${spikePercentage}%` : `${spikePercentage}%`} above average!`,
				bgColor: "bg-red-50",
				borderColor: "border-red-200",
				textColor: "text-red-900",
				subtextColor: "text-red-700",
		  }
		: {
				icon: "📊",
				title: "Normal Activity",
				message: `Today: ${todayClicks} clicks (Threshold: ${threshold})`,
				bgColor: "bg-blue-50",
				borderColor: "border-blue-200",
				textColor: "text-blue-900",
				subtextColor: "text-blue-700",
		  };

	return (
		<div className={`${linkStatus.bgColor} border ${linkStatus.borderColor} rounded-xl overflow-hidden`}>
			{/* Link Status */}
			<div className="p-4">
				<div className="flex items-start gap-3">
					<div className="text-xl">{linkStatus.icon}</div>
					<div>
						<p className={`font-semibold ${linkStatus.textColor}`}>{linkStatus.title}</p>
						<p className={`text-sm ${linkStatus.subtextColor}`}>{linkStatus.message}</p>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="h-px bg-gray-300 opacity-30"></div>

			{/* Activity Status */}
			<div className="p-4">
				<div className="flex items-start gap-3">
					<div className="text-xl">{activityStatus.icon}</div>
					<div>
						<p className={`font-semibold ${activityStatus.textColor}`}>{activityStatus.title}</p>
						<p className={`text-sm ${activityStatus.subtextColor}`}>{activityStatus.message}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
