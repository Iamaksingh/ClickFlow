import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api.js";
import { useToast } from "../components/ToastProvider.jsx";
import LoginCard from "../components/auth/LoginCard.jsx";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { showToast } = useToast();

	const handleLogin = async () => {
		try {
			setLoading(true);
			await loginUser(email, password);
			showToast("Login successful", "success");
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
			<LoginCard
				email={email}
				password={password}
				loading={loading}
				onEmailChange={setEmail}
				onPasswordChange={setPassword}
				onLogin={handleLogin}
			/>
		</div>
	);
}
