import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api.js";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
			setLoading(true);
			setError("");
			await loginUser(email, password);
			navigate("/");
		} catch (err) {
			console.error(err);
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ClickFlow</h2>
				<p className="text-sm text-gray-600 mb-6">Log in to manage your short links.</p>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input
							type="email"
							placeholder="Enter email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<input
							type="password"
							placeholder="Enter password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				{error ? (
					<p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
						{error}
					</p>
				) : null}

				<button
					onClick={handleLogin}
					disabled={loading}
					className="mt-6 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
				>
					{loading ? "Logging in..." : "Login"}
				</button>
			</div>
		</div>
	);
}