import React, { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminLogin = ({ setAdminAuthenticated }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const adminPassword = "admin123";
    
    setTimeout(() => {
      if (password === adminPassword) {
        setAdminAuthenticated(true);
        localStorage.setItem("adminAuth", "true");
        toast.success("Welcome Admin!");
        navigate("/admin");
      } else {
        toast.error("Invalid password");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-3xl text-amber-600"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
              <p className="text-gray-500 text-sm mt-2">Enter password to access dashboard</p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Admin Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-400"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 text-gray-950 py-2 rounded-lg font-semibold hover:bg-amber-300 transition disabled:opacity-50"
              >
                {loading ? (
                  <i className="fas fa-spinner fa-pulse"></i>
                ) : (
                  "Login"
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Default password: <span className="font-mono">admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;