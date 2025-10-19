import React, { useState } from "react";
import { User, Shield, UserPlus, CheckCircle, AlertCircle } from "lucide-react";

interface AdminFormData {
	name: string;
	email: string;
	role: "chairman" | "board";
}

const AdminPage: React.FC = () => {
	const [formData, setFormData] = useState<AdminFormData>({
		name: "",
		email: "",
		role: "board",
	});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage(null);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/users/admin-register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						full_name: formData.name,
						email: formData.email,
						role: formData.role,
						password: "TempPass123!", // Temporary password - user should change on first login
						status: "active",
					}),
				}
			);

			const data = await response.json();

			if (data.success) {
				setMessage({
					type: "success",
					text: `User ${formData.name} registered successfully as ${formData.role}!`,
				});
				setFormData({ name: "", email: "", role: "board" });
			} else {
				setMessage({
					type: "error",
					text: data.message || "Failed to register user",
				});
			}
		} catch (error) {
			setMessage({
				type: "error",
				text: "Network error. Please try again.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto px-4">
				{/* Header */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
					<div className="flex items-center space-x-3 mb-2">
						<Shield className="h-8 w-8 text-blue-600" />
						<h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
					</div>
					<p className="text-gray-600">
						Register new users with administrative roles
					</p>
				</div>

				{/* Registration Form */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div className="flex items-center space-x-3 mb-6">
						<UserPlus className="h-6 w-6 text-blue-600" />
						<h2 className="text-xl font-semibold text-gray-900">
							Register New User
						</h2>
					</div>

					{/* Message Display */}
					{message && (
						<div
							className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
								message.type === "success"
									? "bg-green-50 border border-green-200 text-green-800"
									: "bg-red-50 border border-red-200 text-red-800"
							}`}>
							{message.type === "success" ? (
								<CheckCircle className="h-5 w-5" />
							) : (
								<AlertCircle className="h-5 w-5" />
							)}
							<span>{message.text}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Name Field */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 mb-2">
								Full Name
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									type="text"
									id="name"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
									className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
									placeholder="Enter full name"
								/>
							</div>
						</div>

						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-2">
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
								placeholder="Enter email address"
							/>
						</div>

						{/* Role Selection */}
						<div>
							<label
								htmlFor="role"
								className="block text-sm font-medium text-gray-700 mb-2">
								Role
							</label>
							<select
								id="role"
								name="role"
								value={formData.role}
								onChange={handleInputChange}
								required
								className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
								<option value="board">Board Member</option>
								<option value="chairman">Chairman</option>
							</select>
						</div>

						{/* Info Box */}
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<div className="flex items-start space-x-3">
								<Shield className="h-5 w-5 text-blue-600 mt-0.5" />
								<div className="text-sm text-blue-800">
									<p className="font-medium mb-1">Registration Info:</p>
									<ul className="space-y-1 text-blue-700">
										<li>
											• User will be created with temporary password:{" "}
											<code className="bg-blue-100 px-1 rounded">
												TempPass123!
											</code>
										</li>
										<li>• User should change password on first login</li>
										<li>• Role determines access permissions in the system</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading || !formData.name || !formData.email}
							className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2">
							{loading ? (
								<>
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
									<span>Registering...</span>
								</>
							) : (
								<>
									<UserPlus className="h-5 w-5" />
									<span>Register User</span>
								</>
							)}
						</button>
					</form>
				</div>

				{/* Role Descriptions */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Role Descriptions
					</h3>
					<div className="space-y-4">
						<div className="flex items-start space-x-3">
							<div className="bg-purple-100 p-2 rounded-lg">
								<Shield className="h-5 w-5 text-purple-600" />
							</div>
							<div>
								<h4 className="font-medium text-gray-900">Chairman</h4>
								<p className="text-sm text-gray-600">
									Full administrative access, can manage all communities and
									users
								</p>
							</div>
						</div>
						<div className="flex items-start space-x-3">
							<div className="bg-blue-100 p-2 rounded-lg">
								<User className="h-5 w-5 text-blue-600" />
							</div>
							<div>
								<h4 className="font-medium text-gray-900">Board Member</h4>
								<p className="text-sm text-gray-600">
									Limited administrative access, can manage assigned communities
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminPage;
