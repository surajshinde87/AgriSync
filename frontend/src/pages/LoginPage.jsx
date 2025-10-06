/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaLeaf,
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import axiosInstance from "../utils/axios";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const navigate = useNavigate();

  const getErrorMessage = (error, fallback) => {
    return error.response?.data?.message || error.response?.data || fallback;
  };

  const handleChange = (e) => {
    const value =
      e.target.name === "email"
        ? e.target.value.trim().toLowerCase()
        : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleOtpChange = (e) => setOtp(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  const validateLogin = () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields!");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    const loginData = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/login", loginData);
      if (response.data.success) {
        const { user, token } = response.data;

        // Save user and token
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success(response.data.message || "Login successful!");

        // Redirect based on role
        switch (user.role) {
          case "FARMER":
            navigate("/farmer/dashboard");
            break;
          case "BUYER":
            navigate("/buyer/dashboard");
            break;
          case "DRIVER":
            navigate("/driver/dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      } else {
        toast.error(response.data.message || "Login failed!");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed!"));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your email!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/forgot-password", {
        email: formData.email.trim().toLowerCase(),
        type: "FORGOT_PASSWORD",
      });
      if (response.data.success) {
        toast.success(response.data.message || "OTP sent to your email!");
        setStep(3);
      } else {
        toast.error(response.data.message || "Failed to send OTP!");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to send OTP!"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/reset-password", {
        email: formData.email.trim().toLowerCase(),
        otp,
        newPassword,
      });
      if (response.data.success) {
        toast.success(response.data.message || "Password reset successful!");
        setTimeout(() => {
          setStep(1);
          setFormData({ email: "", password: "" });
          setOtp("");
          setNewPassword("");
        }, 2000);
      } else {
        toast.error(response.data.message || "Password reset failed!");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Password reset failed!"));
    } finally {
      setLoading(false);
    }
  };

  const inputVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-800 to-teal-600 px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div className="relative z-10 w-full max-w-md sm:max-w-lg">
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <FaLeaf className="text-5xl text-green-400 animate-pulse" />
          <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-400">
            AgriSync
          </span>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl"
        >
          <h2 className="text-3xl font-extrabold text-center mb-8 text-green-100">
            {step === 1
              ? "Login to Your Account"
              : step === 2
              ? "Forgot Password"
              : "Set New Password"}
          </h2>

          {step === 1 ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <motion.div className="relative" variants={inputVariants}>
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pl-10 pr-3 py-4 bg-gray-800/50 rounded-xl border border-white/20 text-white"
                  required
                />
              </motion.div>

              {/* Show/Hide Password */}
              <motion.div className="relative" variants={inputVariants}>
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-4 bg-gray-800/50 rounded-xl border border-white/20 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full px-6 py-4 bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold rounded-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" /> Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </motion.button>

              {/*  Forgot + Signup in one neat row */}
              <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center text-sm mt-2 gap-3 sm:gap-0">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-gray-300 hover:text-green-400 underline"
                >
                  Forgot Password?
                </button>
                <a
                  href="/register"
                  className="text-gray-300 hover:text-green-400 underline"
                >
                  Don’t have an account? Sign Up
                </a>
              </div>
            </form>
          ) : step === 2 ? (
            // Forgot Password Form
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full px-4 py-4 bg-gray-800/50 rounded-xl border border-white/20 text-white"
                required
              />
              <motion.button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-bold"
              >
                {loading ? "Sending..." : "Send Reset OTP"}
              </motion.button>
              <button
                onClick={() => setStep(1)}
                type="button"
                className="w-full text-sm text-gray-300 mt-2 underline hover:text-green-500"
              >
                Back to Login
              </button>
            </form>
          ) : (
            // Reset Password
            <form onSubmit={handleResetPassword} className="space-y-5">
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter OTP"
                maxLength="6"
                className="w-full text-center py-4 bg-gray-800/50 rounded-xl border border-white/20 text-white"
                required
              />

              {/* Show/Hide Reset Password */}
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  placeholder="New Password"
                  className="w-full pl-10 pr-10 py-4 bg-gray-800/50 rounded-xl border border-white/20 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <motion.button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-bold"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </motion.button>
              <button
                onClick={() => setStep(1)}
                type="button"
                className="w-full text-sm text-gray-300 mt-2 underline"
              >
                Back to Login
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
