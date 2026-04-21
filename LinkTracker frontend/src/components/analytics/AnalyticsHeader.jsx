import { Link } from "react-router-dom";

export default function AnalyticsHeader() {
	return (
		<div className="flex items-center justify-between mb-6">
			<h1 className="text-3xl font-bold text-gray-800">Link Analytics</h1>
			<Link
				to="/"
				className="text-sm font-medium px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
			>
				Back to Dashboard
			</Link>
		</div>
	);
}
