import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/api.js";
import { useToast } from "../components/ToastProvider.jsx";

export default function Signup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { showToast } = useToast();

	const handleSignup = async () => {
		try {
			setLoading(true);
			await signupUser(email, password);
			showToast("Signup successful", "success");
			navigate("/");
		} catch (err) {
			console.error(err);
			showToast(err.message || "Something went wrong", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
				<p className="text-sm text-gray-600 mb-6">Sign up to start managing your short links.</p>

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

				<button
					onClick={handleSignup}
					disabled={loading}
					className="mt-6 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
				>
					{loading ? "Creating account..." : "Sign up"}
				</button>

				<div className="mt-4 text-center">
					<p className="text-sm text-gray-600">
						Already have an account?{" "}
						<button
							onClick={() => navigate("/login")}
							className="text-blue-600 hover:text-blue-700 font-medium transition"
						>
							Login
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
