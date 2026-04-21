import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLinkStats } from "../services/api";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import StatCard from "../components/analytics/StatCard";
import ClicksPerDayChart from "../components/analytics/ClicksPerDayChart";

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

	return (
		<div className="min-h-screen bg-gray-100 py-10 px-4">
			<div className="max-w-4xl mx-auto">
				<AnalyticsHeader />

				{loading ? (
					<p className="text-gray-500">Loading analytics...</p>
				) : error ? (
					<div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">
						{error}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						<StatCard title="Total Clicks" value={stats.totalClicks} />
						<StatCard title="Peak Hour" value={`${stats.peakHour}:00`} />
						<StatCard title="30 Day Avg" value={stats.thirtyDaysAverage} />
						<div className="bg-white rounded-xl border border-gray-200 p-5 sm:col-span-2 lg:col-span-3">
							<p className="text-sm text-gray-500">Last Accessed</p>
							<p className="text-lg font-semibold text-gray-900 mt-1">{stats.lastAccessed || "N/A"}</p>
						</div>
						<ClicksPerDayChart clicksPerDay={stats.clicksPerDay} trend={stats.trend} />
					</div>
				)}
			</div>
		</div>
	);
}
