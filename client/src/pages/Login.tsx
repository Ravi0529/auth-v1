import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const queryClient = useQueryClient();

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: async ({ username, password }: any) => {
            try {
                const response = await fetch("/v1/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                if (!response.ok) {
                    throw new Error(data.error || "Failed to login");
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
        navigate("/signup");
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center">
                    <FiUserPlus className="mr-2 text-indigo-500" /> Login
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="username">
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
                                placeholder="Enter your username"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6 relative">
                        <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="password">
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
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="text-xs text-indigo-500 mt-1 cursor-pointer underline absolute right-0">
                            Forget Password?
                        </div>
                    </div>

                    {isError && <p className='text-red-500 mt-2'>{error.message}</p>}

                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 rounded-md transition duration-300 cursor-pointer"
                    >
                        {isPending ? "Logging In..." : "Login"}
                    </button>
                </form>

                <div className="text-sm text-center text-gray-600 mt-4">
                    Create an account?{" "}
                    <button
                        onClick={handleNavigateToLogin}
                        className="text-indigo-500 hover:underline ml-1 cursor-pointer">
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
