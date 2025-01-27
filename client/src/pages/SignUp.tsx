import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
    });

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: async ({ firstName, lastName, username, email, password }: any) => {
            try {
                const response = await fetch("/v1/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ firstName, lastName, username, email, password }),
                });

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                if (!response.ok) {
                    throw new Error(data.message || "Failed to create account");
                }
                return data;
            } catch (error) {
                throw new Error(error as string);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(formData);
    };

    const handleNavigateToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center">
                    <FiUserPlus className="mr-2 text-indigo-500" /> Sign Up
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-gray-600 mb-1"
                            htmlFor="firstName"
                        >
                            First Name
                        </label>
                        <div className="flex items-center bg-gray-100 rounded-md">
                            <FaUser className="ml-3 text-gray-400" />
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm bg-transparent outline-none border-none"
                                placeholder="Enter your first name"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-gray-600 mb-1"
                            htmlFor="lastName"
                        >
                            Last Name
                        </label>
                        <div className="flex items-center bg-gray-100 rounded-md">
                            <FaUser className="ml-3 text-gray-400" />
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm bg-transparent outline-none border-none"
                                placeholder="Enter your last name"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label
                            className="block text-sm font-medium text-gray-600 mb-1"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <div className="flex items-center bg-gray-100 rounded-md">
                            <FaUser className="ml-3 text-gray-400" />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm bg-transparent outline-none border-none"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4 relative">
                        <label
                            className="block text-sm font-medium text-gray-600 mb-1"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="flex items-center bg-gray-100 rounded-md">
                            <FaEnvelope className="ml-3 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm bg-transparent outline-none border-none"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6 relative">
                        <label
                            className="block text-sm font-medium text-gray-600 mb-1"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="flex items-center bg-gray-100 rounded-md">
                            <FaLock className="ml-3 text-gray-400" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 text-sm bg-transparent outline-none border-none"
                                placeholder="Create a password"
                                required
                            />
                        </div>
                    </div>

                    {isError && <p className='text-red-500'>{error.message}</p>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 rounded-md transition duration-300 cursor-pointer"
                    >
                        {isPending ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <div className="text-sm text-center text-gray-600 mt-4">
                    Already have an account?{" "}
                    <button
                        onClick={handleNavigateToLogin}
                        className="text-indigo-500 hover:underline ml-1 cursor-pointer"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
