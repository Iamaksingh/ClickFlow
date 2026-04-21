import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLinkStats } from "../services/api";

export default function LinkAnalytics() {
	const { id } = useParams();
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				setError("");
				const response = await getLinkStats(id);
				setStats(response.data);
			} catch (err) {
				setError(err.message || "Failed to load analytics");
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, [id]);

	const maxCount = Math.max(...(stats?.clicksPerDay?.map((entry) => entry.count) || [0]));
	const minCount = Math.min(...(stats?.clicksPerDay?.map((entry) => entry.count) || [0]));
	const trendStyles = {
		up: "bg-green-100 text-green-700",
		down: "bg-red-100 text-red-700",
		flat: "bg-yellow-100 text-yellow-700",
	};
	const trendClass = trendStyles[stats?.trend] || "bg-gray-100 text-gray-700";
	const chartWidth = 760;
	const chartHeight = 280;
	const padding = { top: 20, right: 20, bottom: 50, left: 40 };
	const innerWidth = chartWidth - padding.left - padding.right;
	const innerHeight = chartHeight - padding.top - padding.bottom;
	const points = stats?.clicksPerDay?.length
		? stats.clicksPerDay.map((entry, index, arr) => {
			const x = padding.left + ((arr.length === 1 ? 0.5 : index / (arr.length - 1)) * innerWidth);
			const yRange = maxCount - minCount || 1;
			const y = padding.top + ((maxCount - entry.count) / yRange) * innerHeight;

			return { ...entry, x, y };
		})
		: [];
	const linePath = points
		.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
		.join(" ");
	const yTicks = [maxCount, Math.round((maxCount + minCount) / 2), minCount].filter(
		(value, index, arr) => arr.indexOf(value) === index
	);
	const formatDayOnly = (dateString) => dateString.split("-")[2];

	return (
		<div className="min-h-screen bg-gray-100 py-10 px-4">
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-bold text-gray-800">Link Analytics</h1>
					<Link
						to="/"
						className="text-sm font-medium px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
					>
						Back to Dashboard
					</Link>
				</div>

				{loading ? (
					<p className="text-gray-500">Loading analytics...</p>
				) : error ? (
					<div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">
						{error}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						<div className="bg-white rounded-xl border border-gray-200 p-5">
							<p className="text-sm text-gray-500">Total Clicks</p>
							<p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalClicks}</p>
						</div>

						<div className="bg-white rounded-xl border border-gray-200 p-5">
							<p className="text-sm text-gray-500">Peak Hour</p>
							<p className="text-2xl font-bold text-gray-900 mt-1">{stats.peakHour}:00</p>
						</div>

						<div className="bg-white rounded-xl border border-gray-200 p-5">
							<p className="text-sm text-gray-500">30 Day Avg</p>
							<p className="text-2xl font-bold text-gray-900 mt-1">{stats.thirtyDaysAverage}</p>
						</div>

						<div className="bg-white rounded-xl border border-gray-200 p-5 sm:col-span-2 lg:col-span-3">
							<p className="text-sm text-gray-500">Last Accessed</p>
							<p className="text-lg font-semibold text-gray-900 mt-1">{stats.lastAccessed || "N/A"}</p>
						</div>

						<div className="bg-white rounded-xl border border-gray-200 p-5 sm:col-span-2 lg:col-span-3">
							<div className="flex items-center justify-between mb-3">
								<p className="text-sm text-gray-500">Clicks Per Day</p>
								<span className={`text-xs font-medium px-2 py-1 rounded-full ${trendClass}`}>
									Last 3 day trend: {stats.trend}
								</span>
							</div>

							{stats.clicksPerDay?.length ? (
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
														<text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#6b7280">
															{tick}
														</text>
													</g>
												);
											})}

											<path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" />

											{points.map((point) => (
												<g key={point.date}>
													<circle cx={point.x} cy={point.y} r="4" fill="#2563eb" />
													<text x={point.x} y={chartHeight - padding.bottom + 16} textAnchor="middle" fontSize="10" fill="#6b7280">
														{formatDayOnly(point.date)}
													</text>
												</g>
											))}
										</svg>
									</div>
								</div>
							) : (
								<p className="text-sm text-gray-500">No daily click data available.</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
