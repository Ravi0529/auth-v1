import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

const App: React.FC = () => {

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await fetch("/v1/auth/getHome");
        const data = await response.json();
        if (data.error) return null;
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error as string);
      }
    },
    retry: false,
  })

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
