function parseIstDay(dateStr) {
	return new Date(`${dateStr}T12:00:00+05:30`);
}

function getMostActiveDay(clicksPerDay = []) {
	if (!clicksPerDay.length) return null;
	const maxCount = Math.max(...clicksPerDay.map((d) => d.count));
	if (maxCount <= 0) return null;
	const tied = clicksPerDay.filter((d) => d.count === maxCount);
	const entry = tied[tied.length - 1];
	const day = parseIstDay(entry.date);
	const weekday = day.toLocaleDateString("en-IN", { weekday: "long", timeZone: "Asia/Kolkata" });
	const dateLabel = day.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "Asia/Kolkata",
	});
	return { weekday, dateLabel, count: entry.count };
}

export default function MostActiveDayCard({ clicksPerDay }) {
	const peak = getMostActiveDay(clicksPerDay);

	return (
		<div className="bg-white rounded-xl border border-gray-200 p-5">
			<p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Most active day</p>
			{peak ? (
				<div className="space-y-1">
					<p className="text-lg font-semibold text-gray-800 capitalize">{peak.weekday}</p>
					<p className="text-sm text-gray-600">{peak.dateLabel}</p>
					<p className="text-xs text-gray-500 pt-1">
						{peak.count} {peak.count === 1 ? "click" : "clicks"}
					</p>
				</div>
			) : (
				<p className="text-sm text-gray-600">No clicks in the last 30 days</p>
			)}
		</div>
	);
}
