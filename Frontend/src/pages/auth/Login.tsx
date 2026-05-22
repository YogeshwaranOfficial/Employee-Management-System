import { useState } from "react";
import axios from "axios";
import api from "../../services/api";
import { setToken } from "../../utils/token";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { User, Shield, Briefcase } from "lucide-react";
import { ROUTES } from '../../constants/ROUTES';
 
  const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      setToken(token);
   
      setToken(token);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setUser(user);

      if (user.role === "ADMIN") {
        navigate(ROUTES.ADMIN);
      } else {
        navigate(ROUTES.EMPLOYEE);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Inside this block, 'err' is typed as AxiosError
        setError(err.response?.data?.message || "Login failed");
      } else {
        // Handle non-Axios errors (e.g., programming errors)
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* LEFT SIDE - IMAGE + INFO */}
      <div className="hidden lg:flex flex-2 relative">

        {/* IMAGE */}
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/003/689/228/small_2x/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg"
          className="w-full h-full object-cover"
          alt="login"
        />

        {/* OVERLAY CONTENT */}
        <div className="absolute inset-0 bg-black/60 text-white flex flex-col justify-center p-10 space-y-6">

          <h1 className="text-7xl font-bold">
            Employee Management System
          </h1>

          <p className="text-lg max-w-md">
            A secure platform to manage employees, roles, and profiles with
            role-based access control.
          </p>

          {/* FEATURES */}
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-3">
              <Shield />
              <span>Admin Dashboard & Full Control</span>
            </div>

            <div className="flex items-center gap-3">
              <User />
              <span>Employee Profile & Details</span>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase />
              <span>Department & Job Management</span>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE - LOGIN */}
      <div className="flex flex-1 items-center justify-center p-6">

        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full h-90 max-w-lg text-center space-y-10">

          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
            <p className="text-gray-500 mt-2">
              Login as Admin or Employee
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;