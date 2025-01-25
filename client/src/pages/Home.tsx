import { FaSignOutAlt, FaHome, FaUserCircle } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface AuthUser {
    user?: {
        firstName: string;
        lastName: string;
    };
}

const Home: React.FC = () => {

    const queryClient = useQueryClient();

    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch("/v1/auth/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
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

    const { data: authUser } = useQuery<AuthUser>({ queryKey: ["authUser"] });

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-xl">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <FaHome className="text-indigo-500 text-3xl mr-2" />
                        <h1 className="text-2xl font-bold text-gray-800">Welcome to the Home Page!</h1>
                    </div>
                    <button
                        className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            logout();
                        }}
                    >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                    </button>
                </header>

                <main>
                    <div className="text-center mb-6">
                        <FaUserCircle className="text-indigo-500 text-6xl mx-auto mb-2" />
                        <p className="text-lg font-medium text-gray-600">Hello, {authUser?.user?.firstName} {authUser?.user?.lastName}!</p>
                        <p className="text-gray-500">You're logged in. Explore the app and enjoy your time here.</p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Home;
