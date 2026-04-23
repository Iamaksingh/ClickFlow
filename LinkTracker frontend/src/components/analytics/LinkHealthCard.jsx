const iconSvgClass = "h-5 w-5 shrink-0";

function NormalActivityIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={iconSvgClass}>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
			/>
		</svg>
	);
}

function LinkActiveIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={iconSvgClass}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	);
}

export default function LinkHealthCard({ staleStatus, spikeDetection }) {
	if (!staleStatus || !spikeDetection) {
		return null;
	}

	const { isStale, lastClickDate, daysInactive } = staleStatus;
	const { hasSpike, todayClicks, threshold, spikePercentage } = spikeDetection;

	// Link Status (Stale or Active)
	const linkStatus = isStale
		? {
				icon: <span className="text-xl leading-none">⚠️</span>,
				title: "Link Inactive",
				message: daysInactive ? `No clicks in ${daysInactive} days` : "No clicks recorded",
				bgColor: "bg-yellow-50",
				borderColor: "border-yellow-200",
				textColor: "text-yellow-900",
				subtextColor: "text-yellow-700",
		  }
		: {
				icon: (
					<div className="mt-0.5 text-green-600">
						<LinkActiveIcon />
					</div>
				),
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
				icon: <span className="text-xl leading-none">🚀</span>,
				title: "Spike Detected",
				message: `Today: ${todayClicks} clicks - ${spikePercentage > 0 ? `+${spikePercentage}%` : `${spikePercentage}%`} above average!`,
				bgColor: "bg-red-50",
				borderColor: "border-red-200",
				textColor: "text-red-900",
				subtextColor: "text-red-700",
		  }
		: {
				icon: (
					<div className="mt-0.5 text-blue-600">
						<NormalActivityIcon />
					</div>
				),
				title: "Normal Activity",
				message: `Today: ${todayClicks} clicks (Threshold: ${threshold})`,
				bgColor: "bg-blue-50",
				borderColor: "border-blue-200",
				textColor: "text-blue-900",
				subtextColor: "text-blue-700",
		  };

	return (
		<div className="contents">
			{/* Link activity (spike / normal) */}
			<div className={`${activityStatus.bgColor} border ${activityStatus.borderColor} rounded-xl overflow-hidden`}>
				<div className="p-4">
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Link activity</p>
					<div className="flex items-start gap-3">
						<div className="flex shrink-0 items-start">{activityStatus.icon}</div>
						<div>
							<p className={`font-semibold ${activityStatus.textColor}`}>{activityStatus.title}</p>
							<p className={`text-sm ${activityStatus.subtextColor}`}>{activityStatus.message}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Current state (active / inactive) */}
			<div className={`${linkStatus.bgColor} border ${linkStatus.borderColor} rounded-xl overflow-hidden`}>
				<div className="p-4">
					<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Current state</p>
					<div className="flex items-start gap-3">
						<div className="flex shrink-0 items-start">{linkStatus.icon}</div>
						<div>
							<p className={`font-semibold ${linkStatus.textColor}`}>{linkStatus.title}</p>
							<p className={`text-sm ${linkStatus.subtextColor}`}>{linkStatus.message}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
