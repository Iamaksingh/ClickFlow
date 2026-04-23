export default function DashboardHeader({ onLogout }) {
	return (
		<div className="flex items-center justify-between mb-8">
			<h1 className="text-3xl font-bold text-gray-800">ClickFlow</h1>
			<button
				onClick={onLogout}
				className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
			>
				Logout
			</button>
		</div>
	);
}
