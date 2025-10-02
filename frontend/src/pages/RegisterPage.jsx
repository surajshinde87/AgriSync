/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLeaf, FaUser, FaLock, FaEnvelope, FaMapMarkerAlt, FaUserTie, FaChevronDown, FaCheckCircle, FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../utils/axios";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "FARMER",
    pincode: "",
    city: "",
    state: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [roleOpen, setRoleOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword || !formData.role || !formData.pincode || !formData.city || !formData.state) {
      toast.error("Please fill all fields!");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return false;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error("Pincode must be 6 digits!");
      return false;
    }
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setOtpLoading(true);
    try {
      const response = await axiosInstance.post("/users/register", formData);
      if (response.data.success) {
        toast.success("OTP sent! Check your email.");
        setStep(2);
      } else {
        toast.error(response.data.message || "Failed to send OTP!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP!");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/verify-otp", {
        email: formData.email,
        otp,
        type: "REGISTRATION",
      });
      if (response.data.success) {
        setEmailVerified(true);
        toast.success("Email verified successfully! Registration complete.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(response.data.message || "Invalid OTP!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed!");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "FARMER", label: "Farmer", icon: FaLeaf },
    { value: "BUYER", label: "Buyer", icon: FaUserTie },
    { value: "DRIVER", label: "Driver", icon: FaMapMarkerAlt },
  ];

  const indianStates = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const inputVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02, 
      boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.98 },
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-800 to-teal-600 text-white overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Animated Background Particles */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-10 left-10 w-64 sm:w-72 h-64 sm:h-72 bg-emerald-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-teal-400 opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </motion.div>

      <div className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-xl">
        {/* Logo */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
        >
          <FaLeaf className="text-5xl text-green-400 drop-shadow-2xl animate-pulse" />
          <span className="text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 tracking-tight">
            AgriSync
          </span>
        </motion.div>

        {/* Form Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200">
            {step === 1 ? "Join AgriSync" : "Verify Your Email"}
          </h2>

          {step === 1 ? (
            // Registration Form
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Name Fields */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                custom={0}
                variants={inputVariants}
                initial="initial"
                animate="animate"
              >
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full pl-10 pr-3 py-4 bg-gray-800/50 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 placeholder:text-gray-400"
                    required
                  />
                </div>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full pl-10 pr-3 py-4 bg-gray-800/50 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 placeholder:text-gray-400"
                    required
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                className="relative"
                custom={1}
                variants={inputVariants}
                initial="initial"
                animate="animate"
              >
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full pl-10 pr-3 py-4 bg-gray-800/50 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 placeholder:text-gray-400"
                  required
                />
              </motion.div>

              {/* Password Fields */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                custom={2}
                variants={inputVariants}
                initial="initial"
                animate="animate"
              >
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-10 pr-3 py-4 bg-gray-800/50 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 placeholder:text-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-3 py-4 bg-gray-800/50 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 placeholder:text-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowConfirmPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>

              {/* Role Selection */}
              <motion.div
                className="relative"
                custom={3}
                variants={inputVariants}
                initial="initial"
                animate="animate"
              >
                <div className="relative">
                  <FaUserTie className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setRoleOpen(!roleOpen)}
                      className="w-full pl-10 pr-8 py-4 bg-gray-800/50 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 flex items-center justify-between"
                    >
                      <span className="text-left flex-1">{roleOptions.find((r) => r.value === formData.role)?.label}</span>
                      <FaChevronDown className={`text-gray-400 text-xl transition-transform duration-300 ${roleOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {roleOpen && (
                      <motion.ul
                        className="absolute w-full bg-gray-800/80 rounded-xl border border-white/20 mt-1 z-20 max-h-48 overflow-y-auto shadow-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {roleOptions.map((option) => (
                          <li key={option.value}>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, role: option.value });
                                setRoleOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-colors duration-200 flex items-center gap-3 text-white"
                            >
                              <option.icon className="text-xl text-green-400" />
                              {option.label}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Location Fields */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                custom={4}
                variants={inputVariants}
                initial="initial"
                animate="animate"
              >
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="w-full pl-10 pr-3 py-4 bg-gray-800/50 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 placeholder:text-gray-400"
                    required
                  />
                </div>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full pl-10 pr-3 py-4 bg-gray-800/50 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 placeholder:text-gray-400"
                    required
                  />
                </div>  
              </motion.div>

              {/* State Selection */}
              <motion.div
                className="relative"
                custom={5}
                variants={inputVariants}
                initial="initial"
                animate="animate"
              >
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl z-10" />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setStateOpen(!stateOpen)}
                      className="w-full pl-10 pr-8 py-4 bg-gray-800/50 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300 flex items-center justify-between"
                    >
                      <span className="text-left flex-1">{formData.state || "Select State"}</span>
                      <FaChevronDown className={`text-gray-400 text-xl transition-transform duration-300 ${stateOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {stateOpen && (
                      <motion.ul
                        className="absolute w-full bg-gray-800/80 rounded-xl border border-white/20 mt-1 z-20 max-h-48 overflow-y-auto shadow-lg"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {indianStates.map((state) => (
                          <li key={state}>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, state });
                                setStateOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-colors duration-200 flex items-center gap-3 text-white"
                            >
                              <FaMapMarkerAlt className="text-xl text-green-400" />
                              {state}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Send OTP Button */}
              <motion.button
                type="submit"
                disabled={otpLoading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {otpLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin text-xl" />
                    Sending OTP...
                  </div>
                ) : (
                  "Send OTP & Register"
                )}
              </motion.button>
            </form>
          ) : (
            // OTP Verification Form
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-sm text-gray-300 mb-4">
                  Enter the 6-digit OTP sent to{" "}
                  <span className="font-semibold text-green-400">{formData.email}</span>
                </p>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter OTP"
                    maxLength="6"
                    className="w-full text-center py-5 px-3 bg-gray-800/50 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400 text-3xl tracking-widest font-mono uppercase placeholder:text-gray-400"
                    required
                  />
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full px-6 py-4 bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin text-xl" />
                    Verifying...
                  </div>
                ) : (
                  "Verify & Complete Registration"
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-gray-300 hover:text-green-400 transition-all duration-300 text-sm py-3 border border-gray-600 rounded-xl hover:border-green-400"
                whileHover={{ scale: 1.02 }}
              >
                Back to Registration
              </motion.button>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <a href="/login" className="text-green-400 hover:underline font-semibold transition-colors duration-300">
                Sign In
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}