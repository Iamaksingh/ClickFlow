import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLinkStats } from "../services/api";
import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import StatCard from "../components/analytics/StatCard";
import ClicksPerDayChart from "../components/analytics/ClicksPerDayChart";
import LinkHealthCard from "../components/analytics/LinkHealthCard";
import BreakdownCard from "../components/analytics/BreakdownCard";

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
			<div className="max-w-6xl mx-auto">
				<AnalyticsHeader />

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

						{/* Two-Column Section: Chart + Status Sidebar */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
							{/* Left: Chart (2 columns) */}
							<div className="lg:col-span-2">
								<ClicksPerDayChart clicksPerDay={stats.clicksPerDay} trend={stats.trend} />
							</div>

							{/* Right: Status Sidebar (1 column) */}
							<div className="space-y-4">
								{/* Health Status Card */}
								<LinkHealthCard
									staleStatus={stats.staleStatus}
									spikeDetection={stats.spikeDetection}
								/>

								{/* Breakdown Card */}
								<BreakdownCard
									deviceAnalytics={stats.deviceAnalytics}
									referrerAnalytics={stats.referrerAnalytics}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
