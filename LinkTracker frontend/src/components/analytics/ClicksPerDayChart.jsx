const chartWidth = 760;
const chartHeight = 280;
const padding = { top: 20, right: 20, bottom: 50, left: 40 };

const formatDayOnly = (dateString) => dateString.split("-")[2];

export default function ClicksPerDayChart({ clicksPerDay = [], trend = "flat" }) {
	if (!clicksPerDay.length) {
		return <p className="text-sm text-gray-500">No daily click data available.</p>;
	}

	const maxCount = Math.max(...clicksPerDay.map((entry) => entry.count));
	const minCount = Math.min(...clicksPerDay.map((entry) => entry.count));
	const innerWidth = chartWidth - padding.left - padding.right;
	const innerHeight = chartHeight - padding.top - padding.bottom;
	const trendStyles = {
		up: "bg-green-100 text-green-700",
		down: "bg-red-100 text-red-700",
		flat: "bg-yellow-100 text-yellow-700",
	};
	const trendClass = trendStyles[trend] || "bg-gray-100 text-gray-700";

	const points = clicksPerDay.map((entry, index, arr) => {
		const x = padding.left + (arr.length === 1 ? 0.5 : index / (arr.length - 1)) * innerWidth;
		const yRange = maxCount - minCount || 1;
		const y = padding.top + ((maxCount - entry.count) / yRange) * innerHeight;

		return { ...entry, x, y };
	});

	const linePath = points
		.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
		.join(" ");

	const yTicks = [maxCount, Math.round((maxCount + minCount) / 2), minCount].filter(
		(value, index, arr) => arr.indexOf(value) === index
	);

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-5 sm:col-span-2 lg:col-span-3">
			<div className="flex items-center justify-between mb-3">
				<p className="text-sm text-gray-500">Clicks Per Day</p>
				<span className={`text-xs font-medium px-2 py-1 rounded-full ${trendClass}`}>
					Last 3 day trend: {trend}
				</span>
			</div>

			<div className="space-y-3">
				<p className="text-xs text-gray-500">Y axis: clicks per day</p>
				<div className="w-full overflow-x-auto">
					<svg
						viewBox={`0 0 ${chartWidth} ${chartHeight}`}
						className="w-full min-w-[640px]"
						role="img"
						aria-label="Clicks per day line graph"
					>
						<line
							x1={padding.left}
							y1={chartHeight - padding.bottom}
							x2={chartWidth - padding.right}
							y2={chartHeight - padding.bottom}
							stroke="#d1d5db"
						/>
						<line
							x1={padding.left}
							y1={padding.top}
							x2={padding.left}
							y2={chartHeight - padding.bottom}
							stroke="#d1d5db"
						/>

						{yTicks.map((tick) => {
							const yRange = maxCount - minCount || 1;
							const y = padding.top + ((maxCount - tick) / yRange) * innerHeight;
							return (
								<g key={tick}>
									<line
										x1={padding.left}
										y1={y}
										x2={chartWidth - padding.right}
										y2={y}
										stroke="#f3f4f6"
									/>
									<text
										x={padding.left - 8}
										y={y + 4}
										textAnchor="end"
										fontSize="11"
										fill="#6b7280"
									>
										{tick}
									</text>
								</g>
							);
						})}

						<path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" />

						{points.map((point) => (
							<g key={point.date}>
								<circle cx={point.x} cy={point.y} r="4" fill="#2563eb" />
								<text
									x={point.x}
									y={chartHeight - padding.bottom + 16}
									textAnchor="middle"
									fontSize="10"
									fill="#6b7280"
								>
									{formatDayOnly(point.date)}
								</text>
							</g>
						))}
					</svg>
				</div>
			</div>
		</div>
	);
}
