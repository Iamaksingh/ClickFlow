export default function StatCard({ title, value, className = "" }) {
	return (
		<div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
			<p className="text-sm text-gray-500">{title}</p>
			<p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
		</div>
	);
}
