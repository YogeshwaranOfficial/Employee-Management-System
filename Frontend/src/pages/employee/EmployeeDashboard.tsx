import { useEffect, useState } from "react";
import api from "../../services/api";
import { removeToken } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import { Bell, User, LayoutDashboard, LogOut } from "lucide-react";

type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
  imageUrl?: string;
  phone?: string;
  gender?: string;
  department?: string;
  jobTitle?: string;
  employeeId?: string;
  status?: string;
};

export default function EmployeeDashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  let mounted = true;

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me");

      if (mounted) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  fetchProfile();

  return () => {
    mounted = false;
  };
}, []);

  const handleLogout = () => {
    removeToken();
    navigate("/");
  };

  if (loading) {
    return <div className="p-10 text-xl">Loading...</div>;
  }

  if (!user) {
    return <div className="p-10 text-red-500">Failed to load</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0f172a] text-white flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold p-6">Company</div>

          <nav className="space-y-2 px-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-600">
              <LayoutDashboard size={20} /> Dashboard
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-700 cursor-pointer">
              <User size={20} /> My Profile
            </div>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 m-4 rounded-xl bg-red-500 hover:bg-red-600"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1">
        {/* TOP BAR */}
        <div className="flex justify-between items-center bg-white px-10 py-5 shadow">
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-1 rounded-full">3</span>
            </div>

            <div className="flex items-center gap-3">
               <img src={
                          user.imageUrl
                            ? user.imageUrl.startsWith("http")
                              ? user.imageUrl
                              : `${import.meta.env.VITE_API_URL}/uploads/${user.imageUrl}`
                            : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
                        }
                         className="w-10 h-10 rounded-full"
                      />
              <span className="font-medium">{user.name}</span>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-10 space-y-8">

          {/* PROFILE CARD */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_0_15px_0_rgba(0,0,0,0.1)] flex items-center gap-10">
            <img src={
                user.imageUrl
                  ? user.imageUrl.startsWith("http")
                    ? user.imageUrl
                    : `${import.meta.env.VITE_API_URL}/uploads/${user.imageUrl}`
                  : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
              }
                className="w-36 h-36 rounded-full object-cover"
            />

            <div>
              <h2 className="text-4xl font-bold">{user.name}</h2>
              <p className="text-gray-500 mt-2">{user.email}</p>

              <div className="flex gap-4 mt-4">
                <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full">
                  {user.status || "Active"}
                </span>
              </div>
            </div>
          </div>

          {/* DETAILS */}
          <div className="grid md:grid-cols-2 gap-8">

            {/* PERSONAL */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_0_15px_0_rgba(0,0,0,0.1)]">
              <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>

              <div className="space-y-3 text-lg">
                <p><strong>Phone :</strong> {user.phone || "-"}</p>
                <p><strong>Gender :</strong> {user.gender || "-"}</p>
              </div>
            </div>

            {/* WORK */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_0_15px_0_rgba(0,0,0,0.1)]">
              <h3 className="text-2xl font-semibold mb-4">Work Details</h3>

              <div className="space-y-3 text-lg">
                <p><strong>Employee ID :</strong> {user.employeeId || "-"}</p>
                <p><strong>Department :</strong> {user.department || "-"}</p>
                <p><strong>Job Title :</strong> {user.jobTitle || "-"}</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
