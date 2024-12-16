import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {ReactComponent as CloseIcon} from "../../icons/close.svg";
import {AuthService} from "../../services/AuthService";
import {AuthContext} from "../../store/AuthContext";
import Login from "./Login/Login";

const LoginPage: React.FC = () => {
	const [loginError, setLoginError] = useState<string>("");
	const [otp, setOtp] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [showOtpField, setShowOtpField] = useState<boolean>(false);
	
	const navigate = useNavigate();
	const { setIsLoggedIn } = useContext(AuthContext);
	
	const handleLogin = async (username: string, email: string) => {
		setLoginError("");
		setEmail(email);
		try {
			const loginResult = await AuthService.login(username, email);
			if (loginResult) {
				setShowOtpField(true);
			}
		} catch {
			setLoginError("Incorrect login or password. Please try again.");
		}
	};
	
	const handleVerifyOtp = async () => {
		try {
			const verifyResult = await AuthService.verify(email, otp);
			if (verifyResult) {
				setIsLoggedIn(true);
				navigate("/");
			} else {
				setLoginError("Invalid OTP. Please try again.");
			}
		} catch {
			setLoginError("Failed to verify OTP.");
		}
	};
	
	const handleClose = () => {
		navigate(-1);
	};
	
	return (
			<div className="fixed inset-0 bg-gray-900 bg-opacity-60 z-50 flex justify-center items-center">
				<div className="bg-white w-full max-w-md rounded-lg shadow-xl transform transition-all scale-100">
					<div className="p-6">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold text-gray-800">
								Login to the System
							</h2>
							<CloseIcon
									className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
									onClick={handleClose}
							/>
						</div>
						{!showOtpField ? (
								<Login onLogin={handleLogin} loginError={loginError} />
						) : (
								<div className="space-y-4">
									<label className="text-sm font-medium text-gray-700">
										Enter your access code from gmail
									</label>
									<input
											type="text"
											value={otp}
											onChange={(e) => setOtp(e.target.value)}
											className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
											placeholder="Enter code from gmail"
									/>
									<button
											onClick={handleVerifyOtp}
											className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
									>
										Verify Code
									</button>
								</div>
						)}
						{loginError && (
								<div className="mt-4 text-sm text-red-600">{loginError}</div>
						)}
					</div>
				</div>
			</div>
	);
};

export default LoginPage;
