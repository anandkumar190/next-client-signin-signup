"use client"
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Registration() {
    const router = useRouter();

    const [user, setUser] = React.useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        repassword: ""
    });

    const [errors, setErrors] = React.useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        repassword: ""
    });

    const [apiError, setApiError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const onSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError("");
        setErrors({
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            repassword: ""
        });

        let hasError = false;
        const newErrors = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            repassword: ""
        };

        const firstnameTrim = user.firstname.trim();
        const lastnameTrim = user.lastname.trim();
        const emailTrim = user.email.trim();
        const passwordTrim = user.password.trim();
        const repasswordTrim = user.repassword.trim();

        if (!firstnameTrim) {
            newErrors.firstname = "First name is required";
            hasError = true;
        } else if (firstnameTrim.length < 2) {
            newErrors.firstname = "First name must be at least 2 characters";
            hasError = true;
        }

        if (!lastnameTrim) {
            newErrors.lastname = "Last name is required";
            hasError = true;
        } else if (lastnameTrim.length < 2) {
            newErrors.lastname = "Last name must be at least 2 characters";
            hasError = true;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailTrim) {
            newErrors.email = "Email address is required";
            hasError = true;
        } else if (!emailRegex.test(emailTrim)) {
            newErrors.email = "Please enter a valid email address";
            hasError = true;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
        if (!passwordTrim) {
            newErrors.password = "Password is required";
            hasError = true;
        } else if (passwordTrim.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            hasError = true;
        } else if (!passwordRegex.test(passwordTrim)) {
            newErrors.password = "Password must contain uppercase, lowercase, and a number";
            hasError = true;
        }

        if (!repasswordTrim) {
            newErrors.repassword = "Confirm password is required";
            hasError = true;
        } else if (repasswordTrim !== passwordTrim) {
            newErrors.repassword = "Passwords do not match";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", {
                firstname: firstnameTrim,
                lastname: lastnameTrim,
                email: emailTrim,
                password: passwordTrim
            });
            console.log("Signup Successful", response.data);
            router.push("/dashboard/login");
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || error.message || "An unexpected error occurred during signup.";
            setApiError(errorMsg);
            console.error("Signup failed:", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="flex flex-col lg:flex-row min-h-[700px]">

                    {/* Left Image Section */}
                    <div className="hidden lg:block lg:w-1/2 bg-gray-100">
                        <div className="h-full w-full bg-cover bg-center bg-register-image"></div>
                    </div>

                    {/* Right Form Section */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                        <div className="w-full max-w-md">

                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {loading ? "Loading..." : "Create an Account!"}
                                </h1>
                            </div>

                            {apiError && (
                                <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm">
                                    {apiError}
                                </div>
                            )}

                            <form onSubmit={onSignUp} className="space-y-4">

                                {/* Name Fields */}
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="w-full">
                                        <input
                                            type="text"
                                            id="FirstName"
                                            placeholder="First Name"
                                            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                                                errors.firstname ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                            }`}
                                            value={user.firstname}
                                            onChange={(e) => {
                                                setUser({ ...user, firstname: e.target.value });
                                                setErrors({ ...errors, firstname: "" });
                                                setApiError("");
                                            }}
                                        />
                                        {errors.firstname && (
                                            <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>
                                        )}
                                    </div>

                                    <div className="w-full">
                                        <input
                                            type="text"
                                            id="LastName"
                                            placeholder="Last Name"
                                            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                                                errors.lastname ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                            }`}
                                            value={user.lastname}
                                            onChange={(e) => {
                                                setUser({ ...user, lastname: e.target.value });
                                                setErrors({ ...errors, lastname: "" });
                                                setApiError("");
                                            }}
                                        />
                                        {errors.lastname && (
                                            <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <input
                                        type="email"
                                        id="InputEmail"
                                        placeholder="Email Address"
                                        className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 ${
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

                                {/* Password Fields */}
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="w-full">
                                        <input
                                            type="password"
                                            id="InputPassword"
                                            placeholder="Password"
                                            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 ${
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

                                    <div className="w-full">
                                        <input
                                            type="password"
                                            id="RepeatPassword"
                                            placeholder="Repeat Password"
                                            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                                                errors.repassword ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                            }`}
                                            value={user.repassword}
                                            onChange={(e) => {
                                                setUser({ ...user, repassword: e.target.value });
                                                setErrors({ ...errors, repassword: "" });
                                                setApiError("");
                                            }}
                                        />
                                        {errors.repassword && (
                                            <p className="text-red-500 text-xs mt-1">{errors.repassword}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Register Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full text-white py-3 rounded-lg font-semibold transition duration-200 cursor-pointer ${
                                        loading
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-gray-900 hover:bg-black"
                                    }`}
                                >
                                    {loading ? "Registering..." : "Register Account"}
                                </button>

                                <hr className="my-6 border-gray-200" />

                                {/* Google Button */}
                                <button
                                    type="button"
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition duration-200"
                                >
                                    Register with Google
                                </button>

                                {/* Facebook Button */}
                                <button
                                    type="button"
                                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition duration-200"
                                >
                                    Register with Facebook
                                </button>
                            </form>

                            <hr className="my-6 border-gray-200" />

                            {/* Footer Links */}
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
                                    href="/dashboard/login"
                                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                                >
                                    Already have an account? Login!
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}