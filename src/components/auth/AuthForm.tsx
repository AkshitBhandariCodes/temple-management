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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

	// ✅ Handle Sign Up - Direct API call
	const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage("");

		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const fullName = formData.get("fullName") as string;

		try {
			console.log("📝 Registering user:", email);

			// ✅ Direct API call to backend
			const response = await fetch("http://localhost:5000/api/users/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ full_name: fullName, email, password }),
			});

			const data = await response.json();
			console.log("📡 Registration response:", data);

			if (!response.ok) {
				throw new Error(data.message || "Registration failed");
			}

			// ✅ Save user and token to localStorage
			const { user, token } = data.data;
			localStorage.setItem("temple_user", JSON.stringify(user));
			localStorage.setItem("temple_token", token);

			setMessage("Account created and logged in successfully!");

			// ✅ Redirect to dashboard
			setTimeout(() => {
				navigate("/");
			}, 1000);
		} catch (error: any) {
			console.error("❌ Registration error:", error);
			setMessage(error.message || "Registration failed");
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

					<Tabs defaultValue="signin" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="signin">Sign In</TabsTrigger>
							<TabsTrigger value="signup">Sign Up</TabsTrigger>
						</TabsList>

						{/* 🔹 Sign In Form */}
						<TabsContent value="signin">
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
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Sign In
								</Button>
							</form>
						</TabsContent>

						{/* 🔹 Sign Up Form */}
						<TabsContent value="signup">
							<form onSubmit={handleSignUp} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="signup-fullName">Full Name</Label>
									<Input
										id="signup-fullName"
										name="fullName"
										type="text"
										placeholder="Enter your full name"
										required
										disabled={isLoading}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="signup-email">Email</Label>
									<Input
										id="signup-email"
										name="email"
										type="email"
										placeholder="Enter your email"
										required
										disabled={isLoading}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="signup-password">Password</Label>
									<Input
										id="signup-password"
										name="password"
										type="password"
										placeholder="Create a password (min 6 characters)"
										minLength={6}
										required
										disabled={isLoading}
									/>
								</div>
								<Button
									type="submit"
									className="w-full bg-orange-600 hover:bg-orange-700"
									disabled={isLoading}>
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Sign Up
								</Button>
							</form>
						</TabsContent>
					</Tabs>
				</CardContent>
				<CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
					<p>Contact your administrator to get assigned a role</p>
					<p className="text-xs">
						Roles: super_admin, finance, community_owner, volunteer, etc.
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
