import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLinkStats } from "../services/api";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import StatCard from "../components/analytics/StatCard";
import ClicksPerDayChart from "../components/analytics/ClicksPerDayChart";
import LinkHealthCard from "../components/analytics/LinkHealthCard";
import BreakdownCard from "../components/analytics/BreakdownCard";
import MostActiveDayCard from "../components/analytics/MostActiveDayCard";

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
				setStats(null);
				const response = await getLinkStats(id);
				setStats(response.data);
			} catch (err) {
				setError(err.message || "Failed to load analytics");
				setStats(null);
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, [id]);

	return (
		<div className="min-h-screen bg-gray-100 py-10 px-4">
			<div className="max-w-6xl mx-auto">
				<AnalyticsHeader linkName={stats?.linkName} />

				{loading ? (
					<p className="text-gray-500">Loading analytics...</p>
				) : error ? (
					<div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4">
						{error}
					</div>
				) : (
					<div className="space-y-6">
						{/* 4-Column Metric Strip */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<StatCard title="Total Clicks" value={stats.totalClicks} />
							<StatCard title="Peak Hour" value={`${stats.peakHour}:00`} />
							<StatCard title="30 Day Avg" value={stats.thirtyDaysAverage} />
							<StatCard title="Last Accessed" value={stats.lastAccessed || "N/A"} />
						</div>

						{/* Graph (left) | Link activity, current state, most active day (right) */}
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
							<div className="lg:col-span-2">
								<ClicksPerDayChart clicksPerDay={stats.clicksPerDay} trend={stats.trend} />
							</div>

							<div className="flex min-h-[280px] flex-col justify-between lg:min-h-0 lg:h-full">
								<LinkHealthCard
									staleStatus={stats.staleStatus}
									spikeDetection={stats.spikeDetection}
								/>
								<MostActiveDayCard clicksPerDay={stats.clicksPerDay} />
							</div>
						</div>

						{/* Full width: device | referrer */}
						<BreakdownCard
							deviceAnalytics={stats.deviceAnalytics}
							referrerAnalytics={stats.referrerAnalytics}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
