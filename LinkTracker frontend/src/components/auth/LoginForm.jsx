export default function LoginForm({
	email,
	password,
	loading,
	onEmailChange,
	onPasswordChange,
	onLogin,
	onSignup,
}) {
	return (
		<>
			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
					<input
						type="email"
						placeholder="Enter email"
						value={email}
						onChange={(e) => onEmailChange(e.target.value)}
						className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
					<input
						type="password"
						placeholder="Enter password"
						value={password}
						onChange={(e) => onPasswordChange(e.target.value)}
						className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<button
				onClick={onLogin}
				disabled={loading}
				className="mt-6 w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
			>
				{loading ? "Logging in..." : "Login"}
			</button>

			<div className="mt-4 text-center">
				<p className="text-sm text-gray-600">
					Don't have an account?{' '}
					<button
						onClick={onSignup}
						className="text-blue-600 hover:text-blue-700 font-medium transition"
					>
						Sign up
					</button>
				</p>
			</div>
		</>
	);
}
