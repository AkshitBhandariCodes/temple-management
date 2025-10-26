import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";

import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

export function AuthForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	// ✅ Handle Sign In - Direct API call
	const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage("");

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			console.log("🔐 Signing in user:", email);

			// ✅ Direct API call to backend
			const response = await fetch("http://localhost:5000/api/users/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();
			console.log("📡 Login response:", data);

			if (!response.ok) {
				throw new Error(data.message || "Login failed");
			}

			// ✅ Save user and token to localStorage
			const { user, token } = data.data;
			localStorage.setItem("temple_user", JSON.stringify(user));
			localStorage.setItem("temple_token", token);

			setMessage("Login successful!");

			// ✅ Redirect to dashboard
			setTimeout(() => {
				navigate("/");
			}, 1000);
		} catch (error: any) {
			console.error("❌ Login error:", error);
			setMessage(error.message || "Something went wrong during login.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold text-orange-600">
						Temple Management
					</CardTitle>
					<CardDescription>
						Sign in to access the temple management system
					</CardDescription>
				</CardHeader>
				<CardContent>
					{message && (
						<Alert className="mb-4">
							<AlertDescription>{message}</AlertDescription>
						</Alert>
					)}

					{/* 🔹 Sign In Form - Only Login Available */}
					<form onSubmit={handleSignIn} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="signin-email">Email</Label>
							<Input
								id="signin-email"
								name="email"
								type="email"
								placeholder="Enter your email"
								required
								disabled={isLoading}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="signin-password">Password</Label>
							<Input
								id="signin-password"
								name="password"
								type="password"
								placeholder="Enter your password"
								required
								disabled={isLoading}
							/>
						</div>
						<Button
							type="submit"
							className="w-full bg-orange-600 hover:bg-orange-700"
							disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Sign In
						</Button>
					</form>
				</CardContent>
				<CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
					<p>Contact your administrator to get access</p>
					<p className="text-xs">
						New users must be added by administrators - no self-registration
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
