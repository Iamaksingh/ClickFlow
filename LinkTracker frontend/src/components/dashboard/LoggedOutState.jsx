import { Link } from "react-router-dom";

export default function LoggedOutState() {
	return (
		<div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
			<div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
				<h1 className="text-3xl font-bold text-gray-900 mb-3">Link Tracker</h1>
				<p className="text-gray-600 mb-6">
					You are logged out. Please login to create and manage your links.
				</p>
				<Link
					to="/login"
					className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition cursor-pointer"
				>
					Login
				</Link>
			</div>
		</div>
	);
}
