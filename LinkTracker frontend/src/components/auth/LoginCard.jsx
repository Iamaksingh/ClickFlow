import LoginForm from "./LoginForm";

export default function LoginCard({
	email,
	password,
	loading,
	onEmailChange,
	onPasswordChange,
	onLogin,
}) {
	return (
		<div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
			<h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ClickFlow</h2>
			<p className="text-sm text-gray-600 mb-6">Log in to manage your short links.</p>
			<LoginForm
				email={email}
				password={password}
				loading={loading}
				onEmailChange={onEmailChange}
				onPasswordChange={onPasswordChange}
				onLogin={onLogin}
			/>
		</div>
	);
}
