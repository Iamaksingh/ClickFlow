import { useState } from "react";
import { loginUser } from "../services/api.js";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		try {
			const res = await loginUser(email, password);
			window.location.href = "/";
		} catch (err) {
			console.error(err);
			alert("Something went wrong");
		}
	};

	return (
		<div>
			<h2>Login</h2>

			<input
				type="email"
				placeholder="Enter email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>

			<br />

			<input
				type="password"
				placeholder="Enter password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			<br />

			<button onClick={handleLogin}>Login</button>
		</div>
	);
}