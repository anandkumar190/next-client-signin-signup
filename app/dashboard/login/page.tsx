"use client"
import Link from "next/link"
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = React.useState({
        email: "",
        password: "",
    });
    const [apiError, setApiError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError("");
        setErrors({ email: "", password: "" });

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let hasError = false;
        const newErrors = { email: "", password: "" };

        if (!user.email) {
            newErrors.email = "Email address is required";
            hasError = true;
        } else if (!emailRegex.test(user.email)) {
            newErrors.email = "Please enter a valid email address";
            hasError = true;
        }

        if (!user.password) {
            newErrors.password = "Password is required";
            hasError = true;
        } else if (user.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login Successful", response.data);
            router.push("/dashboard");
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || error.message || "An unexpected error occurred during login.";
            setApiError(errorMsg);
            console.error("Login failed:", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-full max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            
                            {/* Left Image Section */}
                            <div className="hidden lg:block lg:w-1/2 bg-gray-200">
                                <div className="h-full w-full bg-cover bg-center">
                                    {/* Add background image here */}
                                </div>
                            </div>

                            {/* Right Form Section */}
                            <div className="w-full lg:w-1/2">
                                <div className="p-8">
                                    <div className="text-center mb-6">
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {loading ? "Loading..." : "Welcome back"}
                                        </h1>
                                    </div>

                                    {apiError && (
                                        <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm">
                                            {apiError}
                                        </div>
                                    )}

                                    <form onSubmit={onLogin}>
                                        {/* Email */}
                                        <div className="mb-4">
                                            <input
                                                type="email"
                                                id="InputEmail"
                                                placeholder="Enter Email Address..."
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                                                    errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                                }`}
                                                value={user.email}
                                                onChange={(e) => {
                                                    setUser({ ...user, email: e.target.value });
                                                    setErrors({ ...errors, email: "" });
                                                    setApiError("");
                                                }}
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        {/* Password */}
                                        <div className="mb-4">
                                            <input
                                                type="password"
                                                id="InputPassword"
                                                placeholder="Password"
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                                                    errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                                }`}
                                                value={user.password}
                                                onChange={(e) => {
                                                    setUser({ ...user, password: e.target.value });
                                                    setErrors({ ...errors, password: "" });
                                                    setApiError("");
                                                }}
                                            />
                                            {errors.password && (
                                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                            )}
                                        </div>

                                        {/* Remember Me */}
                                        <div className="mb-4 flex items-center">
                                            <input
                                                type="checkbox"
                                                id="customCheck"
                                                className="mr-2 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                            />
                                            <label htmlFor="customCheck" className="text-sm text-gray-700 select-none">
                                                Remember Me
                                            </label>
                                        </div>

                                        {/* Login Button */}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`w-full text-white py-3 rounded-lg font-semibold transition ${
                                                loading
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-gray-900 hover:bg-black"
                                            }`}
                                        >
                                            {loading ? "Signing In..." : "Login Now"}
                                        </button>

                                        <hr className="my-6 border-gray-200" />

                                        {/* Google Login */}
                                        <button
                                            type="button"
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg mb-3 transition"
                                        >
                                            Login with Google
                                        </button>

                                        {/* Facebook Login */}
                                        <button
                                            type="button"
                                            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-lg transition"
                                        >
                                            Login with Facebook
                                        </button>
                                    </form>

                                    <hr className="my-6 border-gray-200" />

                                    <div className="text-center mb-2">
                                        <a
                                            href="/forgot-password"
                                            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                                        >
                                            Forgot Password?
                                        </a>
                                    </div>

                                    <div className="text-center">
                                        <Link
                                            href="/dashboard/registration"
                                            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                                        >
                                            Create an Account!
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}