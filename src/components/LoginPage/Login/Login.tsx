import React, {useState} from "react";

interface ILoginProps {
	onLogin: (username: string, email: string) => void;
	loginError: string;
}

const Login: React.FC<ILoginProps> = ({ onLogin, loginError }) => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	
	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onLogin(username, email);
	};
	
	return (
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
				/>
				<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
				/>
				<button
						type="submit"
						className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
				>
					Login
				</button>
				{loginError && (
						<div className="text-sm text-red-600 text-center">{loginError}</div>
				)}
			</form>
	);
};

export default Login;
